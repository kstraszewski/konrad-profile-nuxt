import { initBotId } from 'botid/client/core'

export default defineNuxtPlugin({
  name: 'oferteo-botid',
  enforce: 'pre',
  setup() {
    // Initialize before protected API calls, including after SPA navigation.
    initBotId({
      protect: [
        { path: '/api/oferto/*', method: '*', advancedOptions: { checkLevel: 'basic' } },
        { path: '/api/ai-to-ui/chat', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
      ],
    })
  },
})
