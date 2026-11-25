import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkSmartQuote } from '../smart-quote.mjs';
const now = new Date('2026-11-25T06:00:00Z');
const example = JSON.parse(readFileSync(new URL('../examples/deal.example.json', import.meta.url)));
const valid = () => ({
  deal: {...example, stage:'quote', destinationPort:'synthetic port', specification:'synthetic verified trim', supplierEvidence:'synthetic supplier ref', destinationEvidence:'synthetic destination ref', supplierPriceValidUntil:'2026-11-27T06:00:00Z', incotermLocation:'synthetic port', paymentTerms:'synthetic terms'},
  freight: {evidence:'synthetic freight ref', route:'synthetic route', currency:'AED', perUnit:4000, quantity:5,destinationPort:'synthetic port',validUntil:'2026-11-26T06:00:00Z'},
  availabilityEvidence:'synthetic stock ref', evidenceReviewed:true, ownerQuoteApproval:true, approvalEvidence:'synthetic approval ref'
});
test('earlier freight expiration wins',()=>{const r=checkSmartQuote(valid(),now);assert.equal(r.canPrepareFinalDraft,true);assert.equal(r.quoteValidUntil,'2026-11-26T06:00:00.000Z');assert.equal(r.economics.totalGrossProfit,70000);});
test('earlier supplier expiration wins',()=>{const q=valid();q.deal.supplierPriceValidUntil='2026-11-25T08:00:00+00:00';assert.equal(checkSmartQuote(q,now).quoteValidUntil,'2026-11-25T08:00:00.000Z');});
test('missing, expired, equal-to-now or timezone-free freight blocks final draft',()=>{for(const v of [undefined,'2026-11-24T06:00:00Z','2026-11-25T06:00:00Z','2026-11-26T06:00:00']){const q=valid();q.freight.validUntil=v;assert.equal(checkSmartQuote(q,now).canPrepareFinalDraft,false);}});
test('missing freight and mismatched quantity, cost, port, currency block',()=>{for(const patch of [null,{quantity:1},{perUnit:3999},{destinationPort:'other'},{currency:'USD'}]){const q=valid();q.freight=patch===null?null:{...q.freight,...patch};assert.equal(checkSmartQuote(q,now).canPrepareFinalDraft,false);}});
test('no release without explicit approval and human evidence review',()=>{for(const patch of [{ownerQuoteApproval:false},{approvalEvidence:''},{evidenceReviewed:false},{availabilityEvidence:''}])assert.equal(checkSmartQuote({...valid(),...patch},now).canPrepareFinalDraft,false);});
test('base deal gate remains effective',()=>{for(const patch of [{newZeroKm:false},{salePricePerUnit:105000},{supplierPriceValidUntil:'2026-11-24T00:00:00Z'},{steering:'unknown'}]){const q=valid();Object.assign(q.deal,patch);assert.equal(checkSmartQuote(q,now).canPrepareFinalDraft,false);}});
test('FOB without freight requires explicit scope evidence',()=>{const q=valid();q.deal.incoterm='FOB';q.deal.costs={...q.deal.costs,freightPerUnit:0};delete q.freight;assert.equal(checkSmartQuote(q,now).canPrepareFinalDraft,false);q.freightNotApplicable=true;q.freightScopeEvidence='synthetic scope';assert.equal(checkSmartQuote(q,now).canPrepareFinalDraft,true);});
test('CIF cannot bypass freight using not-applicable flag',()=>{const q=valid();q.freightNotApplicable=true;q.freightScopeEvidence='synthetic scope';q.deal.costs={...q.deal.costs,freightPerUnit:0};delete q.freight;assert.equal(checkSmartQuote(q,now).canPrepareFinalDraft,false);});
test('invalid clock rejected',()=>assert.throws(()=>checkSmartQuote(valid(),new Date('invalid'))));
