import { initBotId } from 'botid/client/core'

export default defineNuxtPlugin({
  name: 'oferteo-botid',
  enforce: 'pre',
  setup() {
    // Initialize before page requests, including navigation into the demo by SPA.
    // Only the demo API is protected; the initial HTML must load the client first.
    initBotId({
      protect: [{
        path: '/api/oferto/*',
        method: '*',
        advancedOptions: { checkLevel: 'basic' },
      }],
    })
  },
})
