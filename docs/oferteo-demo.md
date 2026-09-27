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

The API key is optional on Vercel: the AI SDK resolves Vercel OIDC. Local development can use `VERCEL_OIDC_TOKEN` from the linked project's environment; the token expires and must be refreshed. Never expose these variables via Nuxt `runtimeConfig.public`. The model identifier was verified against the live AI Gateway model catalog on 2026-09-26.

Seed the **isolated** database, using its owner role only for setup:

```sh
node --env-file=.env scripts/seed-oferto.mjs
NODE_ENV=development node --experimental-strip-types --test scripts/test-oferto.ts scripts/test-oferto-botid.ts scripts/test-oferto-creator.ts
npm run dev
```

Seeding verifies `current_database() = oferteo_demo`, creates only `oferteo_contractors` and `oferteo_rate_limits`, and upserts source profiles by ID. Re-running it is safe. Runtime requires SELECT on `oferteo_contractors` and SELECT/INSERT/UPDATE/DELETE on `oferteo_rate_limits`. The direct owner URL is not used by the application.

## Behavior and API

- The demo opens as a full-viewport assistant. Conversation and project summary scroll independently, and the composer stays at the bottom. On small screens, “Twój plan” switches between the chat and summary while preserving conversation state. “O demie” opens the original proposal in a native dialog. Viewport sizing follows `visualViewport` for keyboard/browser-chrome changes without disabling pinch zoom; body scroll locking is scoped to this route.
- `GET /api/oferto/status` checks Neon with a real catalog query and checks AI Gateway authentication with a cached, read-only credits request; no balance is returned. It returns `{ mode, aiConfigured, databaseConfigured, model, catalogCount, source }`. `mode` distinguishes `live`, unconfigured `demo`, and configured-but-unhealthy `unavailable`. AI availability can still change after this check.
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

The application does not store messages, names, phone numbers, emails, addresses, prompts or completions. The only visit state in Neon is a daily rotating HMAC derived from the network address for cost limits; expired records are pruned on requests. The network address itself is never persisted. The conversation workspace is excluded from PostHog autocapture and session replay using its supported `ph-no-capture` class. AI requests pass through the configured Gateway and model provider; their data policies and account settings apply. Only the error class and HTTP status are logged on AI failures; error payloads, credentials and conversation text are never logged.

## References

- [Vercel AI Gateway](https://vercel.com/docs/ai-gateway)
- [AI SDK structured output](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text)
- [Neon serverless driver configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md)

## Provisioned demo environment

Created on 2026-09-26 in the already connected Neon project `spring-sunset-21767469`:
- Isolated branch `oferteo-demo` (`br-divine-bird-a2cmwfqc`), database `oferteo_demo`.
- Dedicated 0.25 CU compute with 300-second autosuspend.
- Runtime role `oferteo_demo_app`; setup role `oferteo_demo_owner`.
- Local OIDC expires **2026-09-28 05:34 Europe/Warsaw**. Refresh with the linked Vercel project's `vercel env pull` into a temporary ignored env file and copy only `VERCEL_OIDC_TOKEN` into `.env`, preserving the Neon variables. Never overwrite `.env` with the downloaded Vercel file.

No public deployment or cloud environment changes were made. For a Vercel deployment, set private `NUXT_OFERTEO_DATABASE_URL` to the restricted runtime connection and `NUXT_OFERTEO_AI_MODEL=deepseek/deepseek-v4.1-flash`; Gateway uses the deployment's refreshed OIDC identity. Do not deploy the setup-owner URL or a local OIDC token.

## Vercel BotID

`botid/nuxt` configures the official challenge/proxy rewrites. An early client plugin initializes BotID Basic for every method under `/api/oferto/*`, including SPA navigation into the demo. Nitro middleware verifies every demo API request before any handler can query Neon or run inference. Bots and unverified verdicts receive 403; verification failures return 503 without falling through. The existing origin checks and persistent limits remain in place. Basic is selected explicitly on both client and server; Deep Analysis is not enabled.

The status request uses `useFetch(..., { server: false })` so it originates in the browser and carries the BotID challenge. The initial `/oferto/demo` HTML stays renderable so it can load this client verification. BotID protects all data/API operations; it is not a firewall block on the first HTML navigation.

Real verification requires deployment on Vercel and its request context/OIDC. Local `npm run dev` uses the SDK's development behavior (HUMAN); tests exercise HUMAN/BAD-BOT simulation and error handling. A local production server does not supply Vercel request context and correctly refuses protected API requests. For a local preview of the compiled bundle only, explicitly run it with `NODE_ENV=development`; this is simulation, not proof of bot detection. There is no application production bypass, no trusted client bypass header and no cloud firewall change.

After deploying, test both pages in a normal browser, then confirm direct calls without a browser challenge to `/api/oferto/status`, `/api/oferto/chat` and `/api/oferto/offer` are rejected. Actual production classification has not yet been tested.

References: [BotID Nuxt setup](https://vercel.com/docs/botid/get-started), [Basic configuration](https://vercel.com/docs/botid/advanced-configuration), [local development behavior](https://vercel.com/docs/botid/local-development-behavior).
