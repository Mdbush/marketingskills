#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const stages = ['lead', 'qualified', 'rfq', 'quote', 'won', 'lost'];
const number = (value) => typeof value === 'number' && Number.isFinite(value);
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const money = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

/** Offline check only. It never creates CRM records, sends events, or approves payments. */
export function checkDeal(input, now = new Date()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a deal object');
  const errors = [];
  const missing = [];
  const stage = input.stage ?? 'lead';
  const required = (condition, field) => { if (!condition) missing.push(field); };
  if (!stages.includes(stage)) errors.push('stage must use the WOC stage taxonomy');
  required(text(input.source), 'source');
  required(text(input.sourceRecordId), 'sourceRecordId');
  required(text(input.destinationCountry), 'destinationCountry');
  required(text(input.model), 'model');
  required(Number.isInteger(input.quantity) && input.quantity > 0, 'quantity (positive integer)');
  required(text(input.contact?.email) || text(input.contact?.phone), 'contact email or phone');
  const id = text(input.source) && text(input.sourceRecordId)
    ? createHash('sha256').update(JSON.stringify([input.source.trim(), input.sourceRecordId.trim()])).digest('hex')
    : null;
  const qualificationReady = errors.length === 0 && missing.length === 0;
  const quoteMissing = [...missing];
  const requireQuote = (condition, field) => { if (!condition) quoteMissing.push(field); };
  requireQuote(input.newZeroKm === true, 'verified new/zero-km condition');
  requireQuote(['LHD', 'RHD'].includes(input.steering), 'steering (LHD or RHD)');
  requireQuote(text(input.specification), 'vehicle specification/trim');
  requireQuote(text(input.supplierEvidence), 'supplier evidence reference');
  requireQuote(text(input.destinationEvidence), 'destination eligibility evidence reference');
  requireQuote(text(input.destinationPort), 'destination port');
  requireQuote(['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'DAP', 'DPU', 'DDP'].includes(input.incoterm), 'supported Incoterm');
  requireQuote(text(input.incotermLocation), 'Incoterm named place/port');
  requireQuote(text(input.paymentTerms), 'payment terms');
  const expiry = typeof input.supplierPriceValidUntil === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(input.supplierPriceValidUntil)
    ? Date.parse(input.supplierPriceValidUntil) : NaN;
  requireQuote(Number.isFinite(expiry) && expiry > now.getTime(), 'unexpired supplier price with explicit timezone');
  const c = input.costs ?? {};
  const fields = ['vehiclePerUnit', 'freightPerUnit', 'insurancePerUnit', 'exportFeesPerUnit', 'otherPerUnit'];
  for (const field of fields) requireQuote(number(c[field]) && c[field] >= 0, `costs.${field} in AED (explicit zero permitted)`);
  requireQuote(c.currency === 'AED', 'cost currency AED; convert foreign prices before checking');
  requireQuote(number(c.vehiclePerUnit) && c.vehiclePerUnit > 0, 'positive vehicle cost');
  requireQuote(number(input.salePricePerUnit) && input.salePricePerUnit > 0, 'positive sale price per unit AED');
  requireQuote(number(input.minimumGrossMarginPercent) && input.minimumGrossMarginPercent >= 0 && input.minimumGrossMarginPercent < 100, 'owner-selected minimum gross margin percent');
  let economics = null;
  if (fields.every(f => number(c[f]) && c[f] >= 0) && c.currency === 'AED' && number(input.salePricePerUnit) && input.salePricePerUnit > 0 && Number.isInteger(input.quantity) && input.quantity > 0) {
    const costPerUnit = fields.reduce((sum, f) => sum + c[f], 0);
    const grossProfitPerUnit = input.salePricePerUnit - costPerUnit;
    const grossMarginPercent = grossProfitPerUnit / input.salePricePerUnit * 100;
    economics = {
      currency: 'AED', costPerUnit: money(costPerUnit), salePricePerUnit: input.salePricePerUnit,
      grossProfitPerUnit: money(grossProfitPerUnit), grossMarginPercent: money(grossMarginPercent),
      totalCost: money(costPerUnit * input.quantity), totalRevenue: money(input.salePricePerUnit * input.quantity),
      totalGrossProfit: money(grossProfitPerUnit * input.quantity),
      basis: 'Gross contribution before company overhead, finance costs and tax; include all deal costs explicitly.'
    };
    if (number(input.minimumGrossMarginPercent) && grossMarginPercent < input.minimumGrossMarginPercent) errors.push('Gross margin is below the owner-selected threshold');
    if (grossProfitPerUnit <= 0) errors.push('Deal has no positive gross contribution');
  }
  const quoteReady = quoteMissing.length === 0 && errors.length === 0;
  // Commercial acceptance is distinct from technical quotation readiness.
  // Evidence references are placeholders until independently verified.
  const wonMissing = [];
  if (!text(input.buyerAcceptanceEvidence)) wonMissing.push('buyer acceptance or signed PO evidence reference');
  if (!text(input.paymentSecurityEvidence)) wonMissing.push('verified payment security evidence reference');
  if (input.ownerCommercialApproval !== true) wonMissing.push('explicit owner commercial approval');
  const wonReady = quoteReady && wonMissing.length === 0;
  const warnings = ['Evidence references are required but their authenticity and destination rules must be verified by a person.'];
  if (input.marketingConsent !== true) warnings.push('No verified marketing opt-in: do not add this lead to advertising audiences or marketing lists.');
  return {
    sourceEventId: id, stage, qualificationReady, quoteReady, wonReady,
    requestedStageReady: stage === 'won' ? wonReady : stage === 'quote' ? quoteReady : qualificationReady,
    missingWonFields: wonMissing,
    missingQualificationFields: missing, missingQuoteFields: [...new Set(quoteMissing)], errors, warnings, economics,
    automationStatus: 'offline-only',
    dedupeNote: 'Stable ID identifies a source record; destination stage events need a separate stage/version key and a persistent uniqueness constraint.'
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const filename = process.argv[2];
  if (!filename || filename === '--help') {
    console.log('Usage: node woc/check.mjs /absolute/path/to/deal.json\nOutputs a local validation report. No network calls. Exit 2 means requested stage is blocked.');
  } else {
    try {
      const result = checkDeal(JSON.parse(readFileSync(filename, 'utf8')));
      console.log(JSON.stringify(result, null, 2));
      process.exitCode = result.requestedStageReady ? 0 : 2;
    } catch (error) {
      console.error(JSON.stringify({ error: error.message }));
      process.exitCode = 1;
    }
  }
}
