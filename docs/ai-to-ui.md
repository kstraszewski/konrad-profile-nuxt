# AI to UI: chat with a generative interface

`/ai-to-ui` is a live demo of model-driven UI using a fictional bathroom renovation.
The model chooses one of three response types, each rendered by a Vue component:

| Type | Component | What it shows |
| --- | --- | --- |
| `comparison` | `AiToUiComparison.vue` | Sortable table of fictional contractors generated for the question (cards on narrow widths). |
| `checklist` | `AiToUiChecklist.vue` | Generated questions to check off, with a counter. |
| `text` | `AiToUiText.vue` | A short plain-text answer. |

The example buttons send ordinary questions through the same endpoint as the
composer. Their wording gives the model a starting point for choosing the view
and generating the reply. **View sample result** opens a saved, sortable
comparison even when live AI is unavailable. Opening it makes no model
request and does not add messages to the conversation. The route is `noindex`.

## How a reply is built

1. `POST /api/ai-to-ui/chat` receives `{ messages: [{ role, content }] }`.
2. `streamAiToUiChoice` calls AI SDK 7 `streamText` with `Output.object({ schema })`
   through AI Gateway. The model generates the view type, the table rows or
   checklist items it needs, and the answer text.
3. The server validates the structured output and streams it to the browser.
4. `AiToUiChat.vue` maps the view to a registered Vue component and renders
   generated strings as plain text.

`GET /api/ai-to-ui/status` reports whether live AI is available and which model
the server will use.

## Streaming

An accepted chat request is answered as server-sent events
(`AiToUiStreamEvent` in `shared/types/ai-to-ui.ts`). A rejected one (400, 403,
408, 413, 415, 429, 503) is a plain HTTP error before any stream starts.

| Event | Meaning |
| --- | --- |
| `partial` | A provisional reply built from the object the model has written so far. |
| `result` | The reply built from the schema-validated object. Always last. |
| `error` | `{ statusCode, code }` for a failure after the stream started. |

The schema lists the view type and its data before the answer. The page can
render an interactive view as soon as it receives the first valid row or
checklist item. The displayed time to first view runs from sending the question
to the first useful render in the browser, including the request and Vue's DOM
update. Later snapshots add content to the same view.

On the page, `requestAiToUiReply` (`app/utils/aiToUiStream.ts`) reads the
stream. One history entry is updated in place per reply, so a table keeps its
sort order and a checklist keeps its ticks while text is arriving. If the
stream fails or ends without `result`, the provisional entry is removed and
the error state offers a retry.

Closing the connection aborts the model call.

## Production protection

Vercel production requires the existing AI Gateway key and the Neon runtime
connection. The `POST /api/ai-to-ui/chat` route verifies Vercel BotID Basic
before reserving a model call. A rejected or unavailable verification stops the
request before it can use any AI Gateway credits.

The shared budget allows up to 50 model attempts per calendar day in
`Europe/Warsaw`. A single conditional write in Neon reserves a slot across
all Vercel instances. It stores only a date and count under a dedicated key
prefix in `oferteo_rate_limits`. The limit resets at midnight in Warsaw. A full
quota returns `429` with `Retry-After`. Unavailable storage returns `503`
before inference.

## Local AI mode

Use an AI Gateway key in private runtime config (`AI_GATEWAY_API_KEY`) and
enable the local flag:

```sh
NUXT_AI_TO_UI_LOCAL_AI=1 npm run dev -- --host 127.0.0.1
```

The `ai-to-ui-local-ai` Claude Desktop launch configuration enables the flag
as well. If the flag or key is missing, the chat shows that live AI is
unavailable. The default model is `google/gemini-3.5-flash-lite`.
When overriding it with `NUXT_AI_TO_UI_MODEL`, select a Gateway model with
structured output support. The comparison view requires typed contractor
rows with numeric prices, durations and ratings.

## Limits

| What | Limit |
| --- | --- |
| Request body | 6 000 bytes, read from the Node stream with a 5 s deadline |
| Question | 300 characters |
| History sent to the model | last 6 messages |
| Model call | 12 s in total including the stream, bounded output, reasoning off |
| Page | gives up on a reply after 20 s |
| Answer shown | 360 characters |
| Model calls | 50 per Warsaw calendar day across production, 20 per 10 minutes per local process |

Failures carry an app-owned code (`INVALID_REQUEST`, `REQUEST_TIMEOUT`,
`RATE_LIMITED` as HTTP errors, `MODEL_TIMEOUT`, `MODEL_FAILED` as `error`
events). The page maps the status code to its own copy and offers a retry.

## Checks

```sh
npm run test:ai-to-ui
npm run typecheck
```

To check the configured model against all three example questions, run the
opt-in live test. It makes three billable Gateway calls with fictional data.

```sh
AI_TO_UI_LIVE_TEST=1 node --env-file=.env --experimental-strip-types --test --test-name-pattern='live Gateway' scripts/test-ai-to-ui.ts
```

The tests cover request bounds, validation of generated views, the dev-only
and production gates, and the streamed AI SDK call against `MockLanguageModelV4`, including
timeout and disconnect. They also exercise the event stream reader and the body
reader against a real HTTP server.
