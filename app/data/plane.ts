export const plane = {
  company: 'Plane',
  title: 'Konrad Straszewski for Plane',
  description:
    'A company introduction for Plane: practical AI adoption, financial product UX, MCP workflows, and end-to-end product building by Konrad Straszewski.',
  role: {
    href: 'https://plane.com/'
  },
  hero: {
    kicker: 'Konrad Straszewski / For Plane',
    headline: 'I build AI people work with.',
    lead:
      'Plane brings payroll and HR into the tools and agents teams already use. I bring experience building financial product interfaces, leading AI adoption at Lendi, and taking jasne.ai from product idea through code, infrastructure, and distribution.'
  },
  panel: {
    file: 'konrad.for-plane',
    scoreLabel: 'What I bring',
    scoreValue: 'AI building. Product judgment. Financial UX.',
    badge: {
      label: 'Shared direction',
      value: 'Useful agents, clear interfaces',
      description:
        'My current focus is the connection between model context, tools, and the interface people need to get work done.'
    },
    facts: [
      { label: 'Based in', value: 'Szczecin, Poland' },
      { label: 'Current', value: 'AI Manager at Lendi · Building jasne.ai' },
      { label: 'Background', value: 'Financial products since 2017 · AI work since 2023' },
      { label: 'Tools', value: 'TypeScript, Vue/Nuxt, PostgreSQL, Redis, AI SDKs, MCP, PostHog' }
    ]
  },
  relationship: {
    kicker: 'Why Plane',
    heading: 'The next interface for work is already taking shape.',
    copy:
      'Plane connects global payroll and HR with an open API, MCP, a CLI, and Plane Agent. That is close to the work I care about: giving AI useful context and tools, then making the resulting workflow clear enough for a team to rely on.',
    cards: [
      {
        label: 'Financial UX',
        title: 'Make complex work legible',
        description:
          'At Finpack and Lendi, I built financial calculators and B2B/B2C interfaces. That experience shapes how I approach information, decisions, and the next action.'
      },
      {
        label: 'Practical AI',
        title: 'Connect the tool to the team',
        description:
          'At Lendi, I lead AI adoption across tooling, training, internal copilots, workflows, and KPIs. Useful software also needs working habits that support it.'
      },
      {
        label: 'MCP',
        title: 'Bring context into the workflow',
        description:
          'I use MCP with product analytics and explore MCP apps and generative UI. Plane’s approach to agent access makes that interest directly relevant.'
      },
      {
        label: 'Ownership',
        title: 'Stay with the whole product',
        description:
          'Building jasne.ai means owning product, UX, code, infrastructure, AI integration, and distribution. I like carrying a problem through to real use.'
      }
    ]
  },
  fit: {
    kicker: 'Where I could contribute',
    heading: 'AI capability needs a product people can use.',
    cards: [
      {
        index: '01',
        heading: 'Clarity around actions',
        description:
          'In financial workflows, people need to understand what an action will change. I would bring frontend and product judgment to previews, status, corrections, and recovery.'
      },
      {
        index: '02',
        heading: 'Context across surfaces',
        description:
          'Plane Agent works in the app and Slack. I am interested in keeping the task, its context, and the next step understandable as users move between those surfaces.'
      },
      {
        index: '03',
        heading: 'A shorter path to useful',
        description:
          'Plane’s API, MCP, CLI, and sandbox create room to try workflows quickly. My approach is to find a concrete user problem, build a small version, and measure what happens.'
      },
      {
        index: '04',
        heading: 'Adoption as product work',
        description:
          'My AI management work keeps rollout, documentation, training, and feedback close to the build. I would bring that perspective to how teams learn and use Plane’s AI tools.'
      }
    ]
  },
  proof: {
    kicker: 'Track record',
    heading: 'The experience behind the introduction.',
    rows: [
      {
        label: 'Lendi / AI',
        heading: 'Lead company-wide AI adoption since 2024.',
        description:
          'AI strategy, tooling, training, KPIs, internal copilots, and workflow redesign as AI Manager at Lendi.'
      },
      {
        label: 'Lendi / Frontend',
        heading: 'Led a 6-person frontend team from 2020 to 2023.',
        description:
          'Owned the frontend stack across B2B and B2C financial product surfaces, including Nuxt 2 and Nuxt 3.'
      },
      {
        label: 'Finpack / UX',
        heading: 'Built financial product interfaces from 2017 to 2020.',
        description:
          'Frontend development for B2B financial calculators and product interfaces using Vue and Angular.'
      },
      {
        label: 'jasne.ai / Product',
        heading: 'Building a vertical AI product end-to-end.',
        description:
          'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration since 2024.'
      },
      {
        label: 'NeoIQ / Retrieval',
        heading: 'Worked on retrieval-heavy AI in 2023–2024.',
        description:
          'Vector search across large-scale data and knowledge bases, retrieval workflows, and AI surfaces for operational context.'
      },
      {
        label: 'Tooling / Analytics',
        heading: 'Use PostHog as a product analytics tool.',
        description:
          'Implemented PostHog in two organizations. I use its funnels, cohorts, recordings, feature flags, and MCP integration to inform product decisions.'
      }
    ]
  },
  loop: {
    kicker: 'How I work',
    heading: 'Start with the task. Follow through to adoption.',
    steps: [
      {
        label: 'Understand',
        description: 'Watch the workflow, talk to the people doing it, and locate the step that creates friction.'
      },
      {
        label: 'Shape',
        description: 'Define the smallest useful change, the context it needs, and how the user stays in control.'
      },
      {
        label: 'Build',
        description: 'Connect the interface, data, and AI tools. Check the workflow and instrument the outcome.'
      },
      {
        label: 'Learn',
        description: 'Use behavior data, team feedback, and real failures to improve the product and its rollout.'
      }
    ]
  },
  ideas: {
    kicker: 'Proposed experiments',
    heading: 'Four questions I would test with Plane users.',
    file: 'plane/product-experiments.md',
    items: [
      {
        label: 'Action previews',
        description:
          'test which details people need before confirming an agent action: affected workers, changed fields, and the expected result.'
      },
      {
        label: 'Sandbox onboarding',
        description:
          'try a guided first workflow in Plane’s existing sandbox and measure where builders get stuck before reaching a successful test.'
      },
      {
        label: 'Slack-to-app handoff',
        description:
          'explore when an Agent conversation needs a richer view in the app, and how to carry its context into that view.'
      },
      {
        label: 'Correction feedback',
        description:
          'study repeated user corrections and turn them into evaluation cases, clearer interfaces, or better product documentation.'
      }
    ]
  },
  contactHeading: 'Let’s talk about building useful AI products at Plane.',
  cv: {
    hero: {
      kicker: 'Plane / Company introduction',
      headline: 'AI & Product Builder',
      lead: 'AI Manager at Lendi. Building jasne.ai. Financial UX, AI adoption, and MCP workflows.'
    },
    proof: {
      kicker: 'Relevant experience',
      heading: 'Financial products, applied AI, and team leadership.',
      rows: [
        {
          label: 'Lendi / AI',
          heading: 'Lead company-wide AI adoption at Lendi since 2024.'
        },
        {
          label: 'Leadership',
          heading: 'Led a 6-person frontend team at Lendi, 2020–2023.'
        },
        {
          label: 'Financial UX',
          heading: 'Built B2B financial calculators at Finpack, 2017–2020.'
        },
        {
          label: 'jasne.ai',
          heading: 'Own product, UX, code, AI, infrastructure, and distribution.'
        },
        {
          label: 'NeoIQ / AI',
          heading: 'Worked on vector search and retrieval at NeoIQ, 2023–2024.'
        },
        {
          label: 'Analytics / MCP',
          heading: 'Implemented PostHog as an analytics tool in two organizations.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'From user context to useful software.',
      steps: [
        { label: 'Understand', description: 'Start with users, their workflow, and the friction.' },
        { label: 'Shape', description: 'Define the smallest useful change and clear user control.' },
        { label: 'Build', description: 'Connect product, code, AI tools, and instrumentation.' },
        { label: 'Learn', description: 'Improve from product data, team feedback, and real use.' }
      ]
    }
  }
}
