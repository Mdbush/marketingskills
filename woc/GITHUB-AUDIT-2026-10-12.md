# GitHub audit and WOC adaptation — 12 October 2026

## Outcome

Authenticated account: **Mdbush**. All **41 accessible repositories** were cloned at their current default-branch snapshots. Inventory: **128,474 tracked paths**. The initial text/path search found **no WOC, World of Challenge or worldofchallenge implementation** in these snapshots. Public API metadata confirmed many are upstream forks. Missing fork metadata on some rows is recorded as unknown, not guessed.

The main `Mdbush` repository is a **SoloKit digital-product storefront**, not the WOC Webflow site. GitHub ownership does not establish installation, a connected account, a deployment or a working automation.

## Verified fixes

| Repository | Finding | Change | Verification |
|---|---|---|---|
| Mdbush | Missing CRON_SECRET could accept a crafted bearer value | Fail closed when secret is empty/missing | Regression tests for undefined/empty values and no outbound calls |
| Mdbush | Checkout success URL could fall back to localhost or use malformed configuration | Validate canonical origin; checkout uses shared origin; malformed form data returns 400 | Origin and route tests; production build |
| Mdbush | Subscription falsely succeeded without email configuration or after failed welcome delivery | Return 503/502; reject malformed JSON/non-string email; bound in-memory limiter | API tests |
| Mdbush | Signed null events could crash and product text was interpolated into HTML | Validate top-level event, escape HTML, omit buyer email from order log | Webhook regression tests |
| Mdbush | npm audit reported 19 vulnerable dependency entries, including 3 critical | Next 16.4.0, React 19.2.8, Vitest 5.0.4 and compatible dependency refresh; Node 24 CI; Dependabot configuration | Final tests, lint, build; production audit reports zero findings |
| Mdbush | Generated slug was interpolated directly into workflow shell source | Pass generated value through an environment variable | YAML review; does not execute a paid agent |
| ai-workflow-hub-2000- | Full PEM private key embedded in workflow 0924 | Remove exported key; require secure runtime key; document history/rotation limitation | JSON parse and embedded JS syntax check |
| marketingskills | No WOC operating configuration or tested intake/quote gate | Offline checker, synthetic example, operating instructions, configuration and read-only CI | 5 regression tests and marketing CLI syntax checks |

## Validation and limits

- Python: **1,422 files parsed**; 5 additional files flagged. Four are legacy Python 2 test utilities in `runtime`; one is notebook-style `!pip` syntax in `RuView/references/script_1.py`. They are not claimed to be WOC runtime defects and were not blindly converted.
- Workflow YAML: **204 files parsed successfully**. Additional workflow-directory files are not YAML workflows. Mutable action tags, implicit token permissions and scheduled credentialed workflows were recorded as review signals, not asserted vulnerabilities. No bulk permission or action-version rewrite was performed.
- Marketing CLI scripts: **64 passed Node syntax checks**. No authenticated API requests or ad spending were executed by these checks.
- n8n exports: **2,055 JSON files parsed**. This does not test node compatibility, correctness, credentials, webhook authorization or live outcomes. They cannot be imported directly into Make as Make blueprints.
- Secret-pattern scan: tracked UTF-8 files up to 2 MB per file, at the default-branch snapshot only. Candidate locations were inspected/classified without publishing values. Cryptography fixtures, scanner patterns and illustrative key headers are not treated as verified leaked production credentials. The complete key in workflow 0924 is a verified embedded key; ownership, validity and operational use remain unknown.
- SoloKit: **67 tests pass**; ESLint and production build must pass before publishing the repair branch. npm production dependency audit reports **0 findings**. Whole-tree audit retains **5 high entries** in the dev-only `braces → micromatch → fast-glob → Next ESLint` chain. Registry latest braces is 3.0.3, inside the reported affected range; do not force npm audit's incompatible Next ESLint downgrade. Re-check when a compatible patch is published.
- No end-to-end tests/builds of every upstream fork. No entire-history secret scan, security-alert API audit, branch-protection/ruleset/admin-setting verification, deployment-secret inspection, or actual Zoho/Make/Webflow/Drive/ads runtime audit was completed. This is an account-wide inventory/static audit with deeper SoloKit remediation, not a certification that every repository is secure.
- No histories rewritten, repositories deleted/archived, default branches changed, all forks auto-synced, paid services enabled, campaigns launched, or live credentials rotated. These operations need concrete evidence and operational scope.

## Residual priorities

1. If the exported private key was used anywhere, revoke/replace it there. It remains public in history/upstream even after the current-file fix.
2. Review and deploy the SoloKit repair branch; no live deployment is claimed. An existing Vercel connection may deploy on default-branch changes, so the app repair is isolated.
3. Fix/test actual Zoho intake authorization and Make error-alert coverage in the connected account. The GitHub checker is offline and does not repair those live systems.
4. Wire validated field mappings, durable deduplication, stage/version event IDs, attribution and verified consent; test replay and deliberate failure before ads events are enabled.
5. Keep the existing Webflow/Zoho/Drive/Make ownership model. Use SEO, ads, content and video tools selectively; unrelated infrastructure/reference forks have no demonstrated WOC benefit.
6. Avoid committing buyer records, supplier terms, bank/KYC data or execution exports into these public repositories.

## Repository decisions

| Repository | Snapshot files | Priority | WOC use / decision |
|---|---:|---|---|
| [DesktopCommanderMCP](https://github.com/Mdbush/DesktopCommanderMCP) | 296 | Hold | Powerful filesystem/process access; evaluate only for a specific runtime need. |
| [Mdbush](https://github.com/Mdbush/Mdbush) | 530 | Separate application | SoloKit storefront; security fixes prepared on a branch; not the WOC Webflow site. |
| [OfficeCLI](https://github.com/Mdbush/OfficeCLI) | 1,188 | Optional | Commercial documents after runtime validation. |
| [RuView](https://github.com/Mdbush/RuView) | 2,651 | Reference only | Unrelated sensing/AI codebase; notebook-style reference and code not deployed for WOC. |
| [TencentDB-Agent-Memory](https://github.com/Mdbush/TencentDB-Agent-Memory) | 171 | Hold | Additional external memory/data store; no verified need or WOC connection. |
| [ai-workflow-hub-2000-](https://github.com/Mdbush/ai-workflow-hub-2000-) | 2,056 | Hold / security remediation | 2,055 n8n JSON examples; embedded private key removed from one export. |
| [awesome](https://github.com/Mdbush/awesome) | 23 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [awesome-claude-code](https://github.com/Mdbush/awesome-claude-code) | 48 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [awesome-courses](https://github.com/Mdbush/awesome-courses) | 3 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [awesome-ios](https://github.com/Mdbush/awesome-ios) | 20 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [awesome-mac](https://github.com/Mdbush/awesome-mac) | 45 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [awesome-openclaw-skills](https://github.com/Mdbush/awesome-openclaw-skills) | 35 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [awesome-selfhosted](https://github.com/Mdbush/awesome-selfhosted) | 6 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [banana-claude](https://github.com/Mdbush/banana-claude) | 41 | Optional | Creative tooling after runtime/credential review. |
| [better-chatbot](https://github.com/Mdbush/better-chatbot) | 614 | Hold | Another application/auth/database stack; no verified WOC configuration. |
| [books-for-bots](https://github.com/Mdbush/books-for-bots) | 28 | Reference | Document conversion utility; no verified operational dependency. |
| [claude-ads](https://github.com/Mdbush/claude-ads) | 152 | Use first | Paid campaign audit and signal design; access and spend not configured here. |
| [claude-blog](https://github.com/Mdbush/claude-blog) | 246 | Next | Export content drafts; verify price and destination rules before publishing. |
| [claude-code](https://github.com/Mdbush/claude-code) | 216 | Reference only | Upstream coding tooling/examples; owning a fork does not install it. |
| [claude-obsidian](https://github.com/Mdbush/claude-obsidian) | 211 | Reference | Another knowledge store; retain current evidence ownership in Drive. |
| [claude-seo](https://github.com/Mdbush/claude-seo) | 364 | Use first | SEO suite for Claude harness; avoid duplicate installation with Codex equivalent. |
| [claude-shorts](https://github.com/Mdbush/claude-shorts) | 57 | Next | Short-form vehicle video editing after runtime review. |
| [claude-skills](https://github.com/Mdbush/claude-skills) | 4,606 | Selective reference | Large skill collection; select only relevant reviewed workflows. |
| [codebase-memory-mcp](https://github.com/Mdbush/codebase-memory-mcp) | 1,812 | Optional | Code indexing for engineering work; not commercial CRM memory. |
| [codex-seo](https://github.com/Mdbush/codex-seo) | 319 | Use first | SEO suite for Codex harness; validate Webflow and buyer-market pages. |
| [dataforseo-brain](https://github.com/Mdbush/dataforseo-brain) | 434 | Optional | API reference; no live market data without a funded connection. |
| [fablesecondbrain](https://github.com/Mdbush/fablesecondbrain) | 583 | Reference | Knowledge framework; no WOC configuration found. |
| [github-cheat-sheet](https://github.com/Mdbush/github-cheat-sheet) | 9 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [google-genai-brain](https://github.com/Mdbush/google-genai-brain) | 1,839 | Reference | GenAI reference material; no verified WOC integration. |
| [local-competitor-map](https://github.com/Mdbush/local-competitor-map) | 38 | Optional | Local competitor research only; not evidence of overseas buyer demand. |
| [marketingskills](https://github.com/Mdbush/marketingskills) | 388 | Use first | WOC operating toolkit, offline quote checks and CI added. |
| [omniroute](https://github.com/Mdbush/omniroute) | 10,582 | Hold | Large AI router application; no verified WOC deployment or configuration. |
| [open-source-ios-apps](https://github.com/Mdbush/open-source-ios-apps) | 27 | Reference only | Curated lists or reference content; no WOC implementation found. |
| [roslyn](https://github.com/Mdbush/roslyn) | 32,363 | Reference only | Upstream compiler; no verified WOC operational dependency. |
| [runtime](https://github.com/Mdbush/runtime) | 58,141 | Reference only | Upstream .NET runtime; enormous unrelated codebase, not WOC infrastructure. |
| [skills](https://github.com/Mdbush/skills) | 2,314 | Reference only | .NET/C# coding skills; no verified WOC operational dependency. |
| [stitch-skills](https://github.com/Mdbush/stitch-skills) | 84 | Optional | UI development recipes; not connected to WOC Webflow. |
| [superpowers](https://github.com/Mdbush/superpowers) | 172 | Selective reference | Development methodology; not a business automation runtime. |
| [system_prompts_leaks](https://github.com/Mdbush/system_prompts_leaks) | 292 | Reference only | No verified operational use for WOC. |
| [terraform](https://github.com/Mdbush/terraform) | 5,464 | Reference only | Infrastructure codebase; no WOC deployment definitions found. |
| [the-book-of-secret-knowledge](https://github.com/Mdbush/the-book-of-secret-knowledge) | 6 | Reference only | Curated lists or reference content; no WOC implementation found. |

## Reproducibility

`audit-snapshot-2026-10-12.json` records every inspected HEAD SHA, repository/path inventory, metadata availability, workflow review flags, redacted secret-candidate locations and syntax-check results. The inventory was captured before WOC adaptation and repairs, so its SHAs/counts identify the original snapshots.

The WOC checker is documented in `woc/README.md`; its example is entirely synthetic. A margin threshold of 8% in that example is an illustration, not a recommendation or approved WOC policy.
