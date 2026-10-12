# WOC operating toolkit

This folder adapts the marketing repository to World of Challenge Cars. It contains an offline deal checker, a public configuration, synthetic examples, regression tests and the GitHub audit. Nothing here is connected to a live account or installed automatically.

## Use now

Use Node.js 24. Keep real buyer records outside this public repository.

```bash
node --test woc/tests/*.test.mjs
node woc/check.mjs woc/examples/deal.example.json
node woc/check.mjs /absolute/private/path/deal.json
```

The example contains invented prices and a sample margin threshold. It is not an offer, stock confirmation, market forecast or WOC profit estimate. It is RFQ-ready and deliberately quote-blocked. Exit code 0 means the requested stage has the fields required by this checker, 2 means blocked and 1 means invalid input or file. Read `quoteReady` separately from `qualificationReady`.

The checker calculates total deal cost, gross contribution and gross margin on revenue. Margin differs from markup on cost. Include every cost the agreed Incoterm makes WOC responsible for; explicitly enter zero where a cost does not apply. Convert foreign currency prices to AED using an evidenced rate before checking. Company overhead, finance costs and tax are not automatically included. Never describe this output as net profit or guaranteed ROI.

The owner selects a margin threshold per deal. The checker requires quantity, buyer contact, source record ID and destination before qualification; quotation additionally requires new/zero-km status, steering, trim, supplier evidence, destination eligibility evidence, unexpired prices, port, Incoterm/place, payment terms and complete costs. Evidence references do not prove authenticity; a person must check the documents and current destination rules. Loss and won stages still require independent commercial confirmation in Zoho.

## Integration contract to implement in Make

| Area | Intended rule | Live status |
|---|---|---|
| Commercial record | Zoho CRM owns lead, contact, deal and stage | Not tested by this GitHub audit |
| Evidence | Google Drive holds supplier quotes, VIN/spec verification and shipping documents | Not tested |
| Website | Webflow intake uses the same fields | Not tested |
| Automation | Make validates first, then deduplicates/upserts into Zoho | Not installed |
| Stage taxonomy | lead → qualified → rfq → quote → won / lost | Configuration only |
| Source ID | Stable `sourceEventId` from source + native record ID | Implemented offline |
| Deduplication | Persistent uniqueness on source ID; stage events use stage/version IDs | Requires live storage |
| Attribution | Preserve utm_source, utm_medium, utm_campaign, utm_content and utm_term | Map into actual Zoho fields after inspection |
| Ads events | Send only confirmed CRM milestones with matching browser/server event IDs and verified consent | Requires tested CAPI integration |
| Failure alert | Alert with scenario, run ID, sanitized error and retry state | Requires live dispatcher |

Do not invent Zoho API field names, connection IDs, Make blueprint IDs, Meta datasets or consent status. Resolve them from the connected accounts before wiring. Start with one synthetic lead; replay it to prove no duplicates, force an error to prove alert delivery, then verify stage events. A repository commit is not proof of this integration working.

## Which repositories support WOC

| Priority | Repository | Concrete WOC use |
|---|---|---|
| First | marketingskills | Intake checks, buyer-focused copy, landing-page and measurement work |
| First | codex-seo / claude-seo | Choose the suite for the active coding harness; audit Webflow pages and target-market landing pages |
| First | claude-ads | Review campaign structure and conversion signal quality before spending |
| Next | claude-blog | Evidence-backed export explainers; verify regulations and prices before publishing |
| Next | claude-shorts | Turn verified vehicle footage into short-form drafts |
| Optional | OfficeCLI | Prepare RFQs, quote tables and management reports after runtime review |
| Optional | dataforseo-brain | API reference if a funded DataForSEO use case is approved; reference content alone provides no live data |
| Hold | better-chatbot / omniroute / DesktopCommanderMCP | Evaluate only for a proven gap; they introduce another application, runtime or powerful access surface |
| Hold | ai-workflow-hub-2000- | n8n examples, not importable Make blueprints; review individually before adapting |
| Reference | runtime / roslyn / terraform / skills | No verified WOC operational use in the audited snapshot |

Retain upstream attribution and licenses. Do not install every tool, replace the CRM, import all example workflows or add paid services simply because repositories are present.

## Practical order

1. Repair and test the Zoho intake/authorization and error-alert path in the actual Make account.
2. Run one lead through Webflow → Make → Zoho → RFQ/quote evidence and test replay/error handling.
3. Verify the website's real form, buyer-market content and analytics before increasing paid traffic.
4. Compare suppliers using the same verified model/spec, quantity, Incoterm and complete landed costs.
5. Publish approved vehicle photos/video and claims; measure qualified RFQs, quote conversion, contribution and cash cycle.
6. Add further AI tooling only when the preceding steps produce a measured operational benefit.

## Data handling

The repository is public. Keep buyer identities, passports, bank/KYC documents, actual deal files, supplier terms, credentials and exported workflow execution data in private systems. Example data is synthetic. The CLI never transmits input, persists it or authorizes a transaction. Its in-memory checks are not a replacement for CRM controls or legal/commercial verification.
