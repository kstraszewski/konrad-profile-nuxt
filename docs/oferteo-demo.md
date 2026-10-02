# Oferteo: two conversational demos

The `/oferteo` landing page links to exactly two demos. `/offerteo` and `/oferto` redirect there. Demo 1 is the existing contractor search at `/oferto/demo` (also `/oferto/demo-1`). Demo 2 at `/oferto/demo-2` helps a contractor create and revise a service-offer draft through chat. Both assistants occupy the viewport, have navigation between them, use the same AI Gateway model, and are covered by the same BotID middleware and cost limits.

The `/oferto/demo` route demonstrates turning an open description of a bathroom renovation into a structured request and a shortlist of public contractor profiles. It is an independent proposal, not an official Oferteo integration. Profiles are sourced and dated in [oferteo-sources.md](./oferteo-sources.md); the sample currently contains six public profiles, five in Warsaw and one in Pruszków. Only Warsaw bathroom requests are matched. The Pruszków profile is not assumed to serve Warsaw.

## Run locally

Install dependencies and run the standard Nuxt development server. Private server environment variables:

```dotenv
NUXT_OFERTEO_DATABASE_URL=postgresql://restricted-runtime-role:…/oferteo_demo?sslmode=require
OFERTEO_DATABASE_DIRECT_URL=postgresql://demo-owner:…/oferteo_demo?sslmode=require
NUXT_OFERTEO_AI_MODEL=deepseek/deepseek-v4.1-flash
AI_GATEWAY_API_KEY=…
```

The API key is optional on Vercel: the AI SDK resolves Vercel OIDC. Local development uses a private `AI_GATEWAY_API_KEY` scoped to this project with no expiration date. Local OIDC tokens expire; the expired local token has been removed. Never expose these variables via Nuxt `runtimeConfig.public`. The model identifier was verified against the live AI Gateway model catalog on 2026-09-26.

Seed the **isolated** database, using its owner role only for setup:

```sh
node --env-file=.env scripts/seed-oferto.mjs
NODE_ENV=development node --experimental-strip-types --test scripts/test-oferto.ts scripts/test-oferto-botid.ts scripts/test-oferto-creator.ts
npm run dev
```

Seeding verifies `current_database() = oferteo_demo`, creates only `oferteo_contractors` and `oferteo_rate_limits`, and upserts source profiles by ID. Re-running it is safe. Runtime requires SELECT on `oferteo_contractors` and SELECT/INSERT/UPDATE/DELETE on `oferteo_rate_limits`. The direct owner URL is not used by the application.

## Behavior and API

- The search demo starts with a centered heading, one composer, a compact voice control and three example chips. Choosing an example fills the editable prompt without sending it. The composer moves to the bottom when a conversation starts. There is no second toolbar, decorative sidebar photo or empty checklist. The summary appears after the first brief facts arrive and shows only known fields. Conversation and summary scroll independently. On small screens, “Twój plan” switches between the chat and summary while preserving conversation state. Connection failures have one visible retry message; voice availability remains accessible on its disabled button. “O demie” opens the original proposal in a native dialog. Viewport sizing follows `visualViewport` for keyboard/browser-chrome changes without disabling pinch zoom; body scroll locking is scoped to this route.
- `GET /api/oferto/status` checks Neon with a real catalog query, plans the limiter UPSERT and cleanup in a read-only transaction using `EXPLAIN` without `ANALYZE`, and checks AI Gateway authentication with a cached, read-only credits request; no balance is returned. These plans check the runtime role's permissions, columns and conflict key without consuming conversation quota. It returns `{ mode, aiConfigured, aiAvailability, databaseConfigured, model, catalogCount, source }`. `mode` distinguishes `live`, unconfigured `demo`, and configured-but-unhealthy `unavailable`. A healthy catalog with an unusable limiter is unavailable. AI availability can still change after this check.
- `POST /api/oferto/chat` accepts `{ messages: [{ role: 'user' | 'assistant', content: string }] }`. Returns `{ message, suggestions, brief, offers, mode, model, source }`; shared TypeScript types live in `shared/types/oferteo.ts`.
- Each assistant message retains its own brief and shortlist snapshot. Results render directly in the conversation as an expandable search panel, with contractor cards, source links and expandable matching reasons. Later replies do not overwrite earlier cards. Only `role` and `content` are sent back to the API; UI result metadata stays in the browser. The backend continues to use validated structured output; the result panel is a presentation of that response, not a separate SDK tool-call stream.
- DeepSeek V4.1 Flash, via Vercel AI Gateway and the AI SDK, extracts the user's service, city, scope, area, budget and timing, identifies intent, and selects up to three IDs from source data. It also writes concise project-specific advice and asks relevant follow-up questions; comparison and quote-checklist prompts respond to the user's actual requirements. Selection requires a bathroom service, Warsaw and a specific scope. The server validates the structure, filters unknown or duplicate IDs and unsupported locations, then joins full facts from the catalog. All contractor facts and recommendation reasons are rendered by templates from those records. Generated prose is limited by the prompt to the user's project; a server filter rejects obvious source claims, named contractors, links and new numbers. Unknown-price, availability and unsupported-location replies use fixed factual boundaries. This reduces hallucination risk without representing semantic output checks as a guarantee. Senior/step-free adaptations are explicitly unconfirmed in cards because the source data does not establish those capabilities.
- Without database configuration, `source: 'snapshot'` is explicit. A configured database failure returns 503 rather than silently using the snapshot.
- Without Gateway credentials, `mode: 'demo'` uses a limited, deterministic sample parser, visibly labelled by the page. Configured Gateway failures return an error and do not silently switch modes. The UI may observe `aiConfigured: false` when configured credentials are unhealthy; a chat request in that state still returns the live error rather than a sample answer.

## Demo 2: offer creator

`POST /api/oferto/offer` accepts `{ messages, draft }`, where `draft` is the last structured draft or `null`. Both fields are strictly validated and bounded. The response is `{ message, draft, suggestions, mode, model, ready, changes }`; types live in `shared/types/oferteo-creator.ts`. `draft` contains `title`, `company`, `service`, `location`, `scope`, `description`, `price`, `timing`, `conditions` and `nextStep`. Unknown commercial facts remain null. `ready` and changed-field labels are computed by the server, not accepted from the model. Ready means enough information for a reviewable draft, not publication or acceptance.

The desktop workspace has chat and a document preview with independent scroll areas. On mobile, tabs switch between the preserved conversation and preview. Each reply includes an artifact card with its version and changed fields; opening it focuses the current draft. The user can revise the draft with another message, copy its text or download a `.txt` file. Failed requests preserve the previous draft and support retry. The draft is held only in the current browser session and is never published or sent to a client.

Three explicitly fictional starting examples cover bathroom renovation, painting and garden design. Try the bathroom example, then “Zmień cenę na od 22 000 zł brutto za robociznę i skróć opis do 2 zdań. Pozostałe warunki bez zmian.” The price and description should update while the scope, timing and conditions remain. Unknown facts should be requested rather than invented. The prompt requires company, price and timing to be copied from user evidence or retained from the previous draft; additional server checks reject unsupported values. This is a constrained drafting assistant, not a guarantee of semantic correctness: users review the whole text before using it.

Without Gateway credentials, the creator visibly uses a limited sample parser. It understands labelled facts such as `Firma:`, `Usługa:`, `Cena:` and `Termin:`, and a few explicit editing commands. Configured Gateway errors never silently substitute this sample mode. The creator shares persistent Neon counters but does not need contractor catalog data to draft an offer.

## Demo 1: demonstration scenario

1. “Chcę wyremontować łazienkę.” → assistant asks where.
2. “Warszawa, Mokotów.” → asks for scope.
3. “Kompleksowy remont, 6 m². Chcę wymienić wannę na prysznic, budżet do 30 tys. zł, w ciągu 2 miesięcy.” → structured brief and up to three sourced profiles with declared services and source links.
4. “Która firma jest najtańsza?” → explains that public profiles do not contain a reliable price for this job; does not invent a quote.
5. “Jednak w Krakowie.” → the new response contains no matches because the demo has no confirmed coverage there. Earlier Warsaw cards remain attached to their original messages as conversation history.

## Cost and privacy boundaries

POST requires an exact same-origin JSON request. Input is capped at 24 KB, 16 alternating turns, 1500 characters per turn and 9000 total conversation characters. Request-body reading has a 5-second timeout; Neon has an 8-second timeout, AI requests 25 seconds, no retries and at most 1200 output tokens for search or 2200 for offer creation. AI SDK 7's `reasoning: 'none'` disables reasoning for these bounded tasks. Persistent atomic Neon counters, shared across both demos, cap a visitor at 12 requests per 15-minute window, 40 per UTC day, and both demos at 200 per UTC day. This is a demo allowance, not a guaranteed monetary spend limit; set the project's AI Gateway budget independently. Production live mode requires Neon for persistent counters. Without Neon, sample mode uses bounded process-local counters.

The application does not store messages, names, phone numbers, emails, addresses, prompts or completions. The only visit state in Neon is a daily rotating HMAC derived from the network address for cost limits; expired records are pruned on requests. The network address itself is never persisted. The conversation workspace is excluded from PostHog autocapture and session replay using its supported `ph-no-capture` class. AI requests pass through the configured Gateway and model provider; their data policies and account settings apply. AI failures return app-owned error codes and messages; provider payloads, credentials, account balances and conversation text are never logged or returned in error responses.

## References

- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [AI SDK structured output](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text)
- [Neon serverless driver configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md)

## Provisioned demo environment

Restored on 2026-10-02 in the dedicated Neon project `oferteo-demo` (`red-sound-78891499`), in Frankfurt:
- Branch `oferteo-demo` (`br-shiny-surf-b27tcr0n`), database `oferteo_demo`.
- Dedicated fixed 0.25 CU compute (`ep-calm-glitter-b2t8njr2`) with the plan's default autosuspend enabled (`suspend_timeout_seconds: 0`). This account does not permit customizing the interval.
- Restricted runtime role `oferteo_demo_app`: CONNECT, schema USAGE, SELECT(id, profile) on the catalog, and column-level SELECT/INSERT/UPDATE plus table DELETE for counters. It has no inheritance, superuser, role/database creation, replication, schema creation or catalog update privileges.
- Setup role `oferteo_demo_owner`; its direct URL is stored only in ignored local configuration for seeding. Nuxt uses the pooled runtime URL.
- Six public source profiles were restored from the repository. Read-only query plans and a disposable counter transaction verified the runtime permissions, conflict key and atomic increments; the test key was removed in the same transaction.
- On 2026-09-30, the expired local OIDC token was replaced by the project-scoped AI Gateway key `oferto-local-lifetime-2026-09-30`, created without `expiresAt`. Its value is stored only in the ignored local `.env`; both the Gateway authentication check and Gemini Live client-secret issuance succeeded. It remains valid until revoked or otherwise deactivated by Vercel.

The previous project `spring-sunset-21767469` and branch `br-divine-bird-a2cmwfqc` were inaccessible on the authenticated account; both saved connection strings failed authentication. Exact-ID searches of accessible, shared and recoverable projects found no match. The user authorized restoring the demo in its own project. The old resources were not modified.

No public deployment or deployed environment variables were changed. The AI Gateway key was created in the linked Vercel project. For a Vercel deployment, set private `NUXT_OFERTEO_DATABASE_URL` to the restricted runtime connection and `NUXT_OFERTEO_AI_MODEL=deepseek/deepseek-v4.1-flash`; Gateway uses the deployment's refreshed OIDC identity. Do not deploy the setup-owner URL or a local OIDC token.

## Vercel BotID

`botid/nuxt` configures the official challenge/proxy rewrites. An early client plugin initializes BotID Basic for every method under `/api/oferto/*`, including SPA navigation into the demo. Nitro middleware verifies every demo API request before any handler can query Neon or run inference. Bots and unverified verdicts receive 403; verification failures return 503 without falling through. The existing origin checks and persistent limits remain in place. Basic is selected explicitly on both client and server; Deep Analysis is not enabled.

The status request uses `useFetch(..., { server: false })` so it originates in the browser and carries the BotID challenge. The initial `/oferto/demo` HTML stays renderable so it can load this client verification. BotID protects all data/API operations; it is not a firewall block on the first HTML navigation.

Real verification requires deployment on Vercel and its request context/OIDC. Local `npm run dev` uses the SDK's development behavior (HUMAN); tests exercise HUMAN/BAD-BOT simulation and error handling. A local production server does not supply Vercel request context and correctly refuses protected API requests. For a local preview of the compiled bundle only, explicitly run it with `NODE_ENV=development`; this is simulation, not proof of bot detection. There is no application production bypass, no trusted client bypass header and no cloud firewall change.

After deploying, test both pages in a normal browser, then confirm direct calls without a browser challenge to `/api/oferto/status`, `/api/oferto/chat` and `/api/oferto/offer` are rejected. Actual production classification has not yet been tested.

References: [BotID Nuxt setup](https://vercel.com/docs/botid/get-started), [Basic configuration](https://vercel.com/docs/botid/advanced-configuration), [local development behavior](https://vercel.com/docs/botid/local-development-behavior).


## Voice conversations (2026-09-30)

Both demos include **Porozmawiaj**, live captions in the existing chat, mute/unmute,
and end controls. Search voice calls update the brief and sourced contractor cards;
creator calls update the same versioned offer preview. Text can be sent during a
connected session, and ending voice preserves the transcript and results for text
continuation. Voice uses `google/gemini-3.8-live`, verified in the live Vercel model
catalog on 2026-09-30. Structured search/draft processing still uses the existing
DeepSeek endpoints and factual validation.

The installed AI SDK 7.0.116 exports `experimental_useRealtime` for React, but does
not export a Vue equivalent. `OferteoRealtimeSession` adapts the SDK's exported
`Experimental_AbstractRealtimeSession` to Vue, using the same WebSocket, PCM audio,
transcript, interruption and tool runtime rather than adding React to Nuxt. It is
loaded only when voice is started. Input PCM is 16 kHz, playback 24 kHz.
Input transcription is enabled with `{}`. A real Gateway check rejected the optional
`language: 'pl'` hint with WebSocket close code 1008; removing that hint allowed the
full session configuration, including the workspace tool, to connect. Polish is
specified in the assistant instructions.

`POST /api/oferto/realtime?mode=search|creator` requires the existing BotID check,
exact origin, bounded JSON body and shared persistent limits. It mints a single-use
60-second Gateway client secret for the fixed Gemini model; the browser never gets
the Gateway API key or OIDC token. Submitted session settings cannot change the
minted model. The returned `update_workspace` tool has no model-generated arguments:
it calls `/api/oferto/chat` or `/api/oferto/offer` with actual chat captions. Those
routes retain their normal validation and limits. The browser renders the validated
response and returns it to Gemini to discuss. Duplicate calls for the same user
transcript reuse the result. Failed tool calls do not claim new results.

Microphone access requires an explicit click and browser permission on HTTPS (or
localhost). Audio is transmitted through Vercel AI Gateway to Gemini; transcripts
also go through the existing text-processing route. The application does not store
audio or transcripts on the server. The existing analytics exclusion covers the
voice UI. Stop, navigation, a hidden tab, connection failure, and unmount release
microphone tracks and audio resources. Cancelled starts also release late-arriving
microphone streams. There is no silent fallback to simulated voice.

Startup distinguishes microphone permission, loading the voice runtime, and
connecting to AI. These stages are bounded to 20, 15, and 30 seconds respectively;
the SDK also has its own 25-second transport startup deadline. Ignoring a permission
prompt no longer leaves the composer busy indefinitely. Timeout and cancellation
release late microphone streams, and no connection starts after an expired attempt.
SDK `error` status is observational: teardown happens in `onError`, preserving the
original cause and the existing credit/quota recovery behavior.

The UI ends a session after three minutes. This is a **client-side UX limit**, not a
server-enforced monetary cap. The 60-second token TTL limits opening a socket, not
its connected duration. Keep the project's Gateway budget configured separately;
existing request counters cover token minting and workspace tool requests.

Validation: `npm run test:oferteo`, `npm run build`, and browser checks with simulated
normalized Gateway events and microphone streams. Checks cover search cards, city
corrections with empty results, draft updates, mobile layout, mute, permission denial,
cancel during microphone acquisition, transcript continuity and resource cleanup.
No real microphone was captured by those checks. Real Gemini audio quality still
requires a microphone test. The project-scoped Gateway key passed authentication,
Gemini Live client-secret issuance and a real WebSocket session with the full
configuration and workspace tool without using a microphone. After restoring Neon
on 2026-10-02, the live status check enables both voice buttons and the application's
protected realtime endpoint successfully issues a short-lived token with the
workspace tool. The empty-history voice credit error keeps the status recovery
action visible; restored availability clears the local credit error.
`npm run typecheck` still reports pre-existing errors in SEO, MCP CV, PostHog and
PDF generation. BotID header types, offer schema issue forwarding and Retry-After
typing were repaired on 2026-10-02; no Oferteo errors remain.

## Error recovery and credit exhaustion (2026-10-02)

Live chat, offer generation and voice-token issuance use an authenticated read-only
Gateway credit preflight. Concurrent probes share one promise; ready and exhausted
states are cached for 60 seconds, other availability failures for 15 seconds. The
SDK's `balance:string` and `availableBalance:string` are accepted without exposing
amounts. A zero balance or financial Gateway 402 pauses new paid calls. A 402 during
generation or token minting sets the same pause; later concurrent errors and stale
probes cannot clear it. SDK cause/retry wrappers are inspected without treating
upstream provider quota errors as Gateway credit exhaustion.

HTTP 402 returns `AI_CREDITS_EXHAUSTED` and `retryable:false`. HTTP 429 stays distinct
and preserves `Retry-After` in response headers and structured data. Neither SDK nor
client automatically retries paid calls. Both UIs retain the current conversation,
failed message and offer draft in this browser session; drafts remain editable while
sending and starting voice are paused. "Sprawdź dostępność" makes a read-only status
request. After a fresh successful probe the user may explicitly retry the saved
message; recovery does not send anything automatically. Voice releases the microphone
and connection when credits run out or workspace calls hit a rate limit. The SDK's
token-setup error retains only its status, so its 429 uses a conservative 60-second
client cooldown; subsequent server requests still enforce the real rate-limit window.

BotID now rejects missing challenges before provider verification, malformed verdicts
and deployed bypass verdicts. Development simulation is permitted only for an explicit
local development environment, never Vercel preview or production. API middleware
covers search, creator, voice tokens, status and future demo routes before their handlers.

Validation: 57 tests pass, including real SDK calls with a fake transport (no paid
requests), credit pause/recovery, concurrent failures, bot rejection, safe error
messages, client cooldown and read-only limiter readiness. A real browser request
retained its message after a 503. The production build passes after the voice
recovery fixes. With the restored database, real browser requests
return three matching contractor cards with a populated brief, create an offer draft,
and update its area, price and next step to version 2. Both demos are ready for voice;
token issuance returns 200. These browser checks have no console warnings or errors.
Local status reports `mode: live`, `databaseConfigured: true`, six profiles and
`source: neon`. Deployed environment values and billing settings were not changed.

Neon CLI recovery on 2026-10-02: the official `neon` package is installed globally
at version 7.0.6 and browser login now succeeds. Complete login in the single tab
automatically opened by the CLI; do not reopen its authorization URL in another tab
or reuse an earlier callback URL. The first duplicated-tab attempt failed with a
CSRF mismatch; the single-tab attempt succeeded. Project API reads work on the
renewed session. Exact-ID, server-filtered searches do not find the old project in
the current account's accessible organizations, shared projects or recovery window.
The old project lookup still returns an authorization error; this does not establish
whether it was deleted or belongs to a different account. The authorized isolated
restoration above replaced both local demo connection strings, verified runtime
identity and privileges, and restarted Nuxt with the new configuration. Secrets
remain in the ignored local `.env` with mode 0600 and were never printed.
Limiter infrastructure failures now return `LIMIT_STORAGE_UNAVAILABLE` (503), distinct
from `DEMO_RATE_LIMITED` (429 with `Retry-After`). Readiness probes retry on subsequent
status requests, so a repaired connection is not hidden by a cached database failure.

References: [Gateway rate limits](https://vercel.com/docs/ai-gateway/rate-limits),
[Gateway budgets](https://vercel.com/docs/ai-gateway/observability-and-spend/budgets).

References: [AI SDK Realtime](https://ai-sdk.dev/docs/ai-sdk-core/realtime),
[Gemini 3.8 Live on AI Gateway](https://vercel.com/ai-gateway/models/gemini-3.8-live).
