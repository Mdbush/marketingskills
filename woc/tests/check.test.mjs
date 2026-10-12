import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkDeal } from '../check.mjs';
const now = new Date('2026-10-12T12:00:00Z');
const example = JSON.parse(readFileSync(new URL('../examples/deal.example.json', import.meta.url)));
const valid = () => ({ ...example, stage: 'quote', destinationPort: 'example port', specification: 'verified example trim', supplierEvidence: 'example supplier evidence', destinationEvidence: 'example eligibility evidence', supplierPriceValidUntil: '2026-10-20T00:00:00Z', incotermLocation: 'example port', paymentTerms: 'example agreed payment terms' });
test('example qualifies for RFQ but remains blocked from a quote', () => {
  const r = checkDeal(example, now);
  assert.equal(r.qualificationReady, true); assert.equal(r.quoteReady, false);
  assert.equal(r.economics.totalGrossProfit, 70000);
  assert.equal(r.economics.grossMarginPercent, 11.67);
});
test('complete deal passes and source ID remains stable', () => {
  const a = checkDeal(valid(), now); const b = checkDeal({ ...valid(), stage: 'won' }, now);
  assert.equal(a.quoteReady, true); assert.equal(a.sourceEventId, b.sourceEventId);
});
test('expired prices, wrong currency, missing steering and used vehicles block quoting', () => {
  for (const patch of [{ supplierPriceValidUntil: '2026-10-01T00:00:00Z' }, { supplierPriceValidUntil: '2026-10-20' }, { steering: 'unknown' }, { newZeroKm: false }, { costs: { ...example.costs, currency: 'USD' } }]) {
    assert.equal(checkDeal({ ...valid(), ...patch }, now).quoteReady, false);
  }
});
test('low margin and negative costs block quote', () => {
  assert.equal(checkDeal({ ...valid(), salePricePerUnit: 105000 }, now).quoteReady, false);
  assert.equal(checkDeal({ ...valid(), costs: { ...example.costs, freightPerUnit: -1 } }, now).quoteReady, false);
});
test('does not coerce strings, fractional units, null or missing source IDs', () => {
  for (const patch of [{ quantity: '5' }, { quantity: 1.5 }, { sourceRecordId: '' }]) assert.equal(checkDeal({ ...valid(), ...patch }, now).qualificationReady, false);
  assert.throws(() => checkDeal(null));
});
