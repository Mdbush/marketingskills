import { checkDeal } from './check.mjs';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const nonempty = v => typeof v === 'string' && v.trim().length > 0;
const timestamp = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(v) ? Date.parse(v) : NaN;
const positive = v => typeof v === 'number' && Number.isFinite(v) && v > 0;

// Advisory only: no network, no customer communication or CRM writes.
export function checkSmartQuote(input, now = new Date()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Expected quote object');
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new TypeError('Invalid clock');
  const deal = input.deal;
  const base = checkDeal(deal, now);
  const blockers = [...base.missingQuoteFields, ...base.errors];
  const require = (condition, label) => { if (!condition) blockers.push(label); };
  const shippingRequired = ['CFR','CIF','DAP','DPU','DDP'].includes(deal.incoterm);
  const freight = input.freight;
  const supplierEnd = timestamp(deal.supplierPriceValidUntil);
  let freightEnd = NaN;
  if (shippingRequired || (typeof deal.costs?.freightPerUnit === 'number' && deal.costs.freightPerUnit > 0)) {
    require(nonempty(freight?.evidence), 'written freight quote reference');
    require(nonempty(freight?.route), 'verified freight route');
    require(freight?.currency === 'AED', 'freight currency AED');
    require(positive(freight?.perUnit) && freight.perUnit === deal.costs?.freightPerUnit, 'freight price matches deal cost');
    require(freight?.quantity === deal.quantity, 'freight quote covers requested quantity');
    require(freight?.destinationPort === deal.destinationPort, 'freight destination matches deal');
    freightEnd = timestamp(freight?.validUntil);
    require(Number.isFinite(freightEnd) && freightEnd > now.getTime(), 'unexpired freight quote with explicit timezone');
  } else {
    require(input.freightNotApplicable === true && nonempty(input.freightScopeEvidence), 'written evidence that freight quote is outside WOC scope');
  }
  require(nonempty(input.availabilityEvidence), 'supplier availability evidence');
  require(input.evidenceReviewed === true, 'human evidence review');
  const end = Math.min(supplierEnd, Number.isFinite(freightEnd) ? freightEnd : Infinity);
  require(Number.isFinite(end) && end > now.getTime(), 'valid combined price expiry');
  const e = base.economics;
  require(e && [e.totalCost,e.totalRevenue,e.totalGrossProfit,e.grossMarginPercent].every(Number.isFinite), 'finite deal economics');
  const reviewReady = base.quoteReady && blockers.length === 0;
  const approvalRecorded = input.ownerQuoteApproval === true && nonempty(input.approvalEvidence);
  const canPrepareFinalDraft = reviewReady && approvalRecorded;
  return {
    status: canPrepareFinalDraft ? 'FINAL_DRAFT_READY_FOR_HUMAN_RELEASE' : 'ESTIMATE_ONLY',
    reviewReady, canPrepareFinalDraft,
    quoteValidUntil: reviewReady ? new Date(end).toISOString() : null,
    blockers: [...new Set([...blockers,...(approvalRecorded ? [] : ['owner quote approval evidence'])])],
    economics: e,
    sourceEventId: base.sourceEventId,
    automationStatus: 'offline-only',
    notice: 'Evidence references and approval flags are not authentication. Verify against private records. Gross contribution excludes unentered finance, overhead and tax. Recheck prices immediately before release. Never sends or authorizes a quote.'
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = checkSmartQuote(JSON.parse(readFileSync(process.argv[2], 'utf8')));
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.canPrepareFinalDraft ? 0 : 2;
  } catch (error) {
    console.error(JSON.stringify({error:error.message}));
    process.exitCode = 1;
  }
}
