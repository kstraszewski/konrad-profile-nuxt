export const profile = {
  person: {
    name: 'Konrad Straszewski',
    initials: 'KS',
    role: 'AI Manager & Builder',
    currentRole: 'AI Manager · Lendi',
    location: 'Szczecin, Poland',
    availability: 'Available · senior AI roles · Warsaw / remote',
    openTo: 'Head of AI · AI Lead',
    stackPosture: 'vendor-agnostic',
    email: 'koonradstraszewski@gmail.com',
    phone: '+48 794 175 956',
    phoneHref: 'tel:+48794175956'
  },
  links: {
    email: {
      label: 'Email',
      value: 'koonradstraszewski@gmail.com',
      href: 'mailto:koonradstraszewski@gmail.com'
    },
    phone: {
      label: 'Phone',
      value: '+48 794 175 956',
      href: 'tel:+48794175956'
    },
    lendi: {
      label: 'Lendi',
      value: 'lendi.pl',
      href: 'https://lendi.pl',
      external: true
    },
    github: {
      label: 'GitHub',
      value: 'github.com/kstraszewski',
      href: 'https://github.com/kstraszewski',
      external: true
    },
    linkedin: {
      label: 'LinkedIn',
      value: 'in/konrad-straszewski',
      href: 'https://www.linkedin.com/in/konrad-straszewski-b4a939165/',
      external: true
    },
    jasne: {
      label: 'jasne.ai',
      value: 'jasne.ai',
      href: '/jasne.ai'
    }
  },
  nav: {
    main: [
      { label: 'Now', href: '#now' },
      { label: 'Lendi', href: '#lendi' },
      { label: 'jasne.ai', href: '/jasne.ai' },
      { label: 'Principles', href: '#principles' },
      { label: 'Track record', href: '#track' },
      { label: 'Interests', href: '#interests' },
      { label: 'CV', href: '/cv' },
      { label: 'Contact', href: '#contact' }
    ],
    posthog: [
      { label: 'Fit', href: '#fit' },
      { label: 'Proof', href: '#proof' },
      { label: 'Ideas', href: '#ideas' },
      { label: 'CV', href: '/cv' },
      { label: 'Contact', href: '#contact' }
    ]
  },
  hero: {
    eyebrow: 'Available · senior AI roles · Warsaw / remote',
    meta: 'EST. 2017 - LENDI · 2024 → AI',
    title: {
      first: 'I rewire teams',
      around: 'around',
      highlight: 'AI',
      last: 'then ship the products.'
    },
    intro: {
      years: '8.5 years at',
      company: 'Lendi',
      path: 'frontend developer, then lead, then R&D, now',
      role: 'AI Manager & Builder',
      mandate:
        'My mandate: redefine the role of the engineer - from feature-shipper to product builder - and prove it ships.',
      side: "On the side I'm building",
      sideBuild: 'jasne.ai'
    },
    facts: [
      { label: 'Currently', value: 'AI Manager · Lendi' },
      { label: 'Side build', value: 'jasne.ai' },
      { label: 'Based', value: 'Szczecin, Poland' },
      { label: 'Open to', value: 'Head of AI · AI Lead' },
      { label: 'Stack', value: 'vendor-agnostic' }
    ],
    marquee: [
      { text: 'AI Manager', strong: true },
      { text: 'Builder of jasne.ai', italicWord: 'jasne.ai' },
      { text: '8.5 yrs at Lendi', strong: true },
      { text: 'Vendor-agnostic by design' },
      { text: 'Programmers → product builders', strong: true }
    ]
  },
  now: {
    label: '§ 01 · Now',
    sub: '2026 - present',
    heading:
      "Three things, one thesis: the engineer's job has changed and the orgs that catch up will eat the ones that don't.",
    items: [
      {
        heading: 'Leading AI adoption at Lendi',
        description:
          "Company-wide rollout. Strategy, tooling, training, KPIs. The unglamorous work of moving an org from 'we should do something with AI' to 'this is how we ship now'.",
        tag: 'Day job'
      },
      {
        heading: 'Building jasne.ai',
        description:
          'A vertical AI product. Solo, end-to-end. Vendor-agnostic stack. The proof that the model I sell at Lendi works in the wild.',
        tag: 'Side build'
      },
      {
        heading: 'Writing the product-builder playbook',
        description:
          'Notes, essays, internal memos. What the engineering role becomes when AI is the default collaborator - and what hiring, performance, and team shape look like next.',
        tag: 'Public'
      },
      {
        heading: 'Exploring AI-to-UI and MCP apps',
        description:
          'Generative UI as a product surface: agents that render the interface they need, and MCP apps as the bridge between tools, data, and real workflows.',
        tag: 'Current focus'
      }
    ]
  },
  lendi: {
    label: '§ 02 · Lendi',
    sub: '8.5 yrs · FE → Lead → R&D → AI',
    heading: {
      accent: 'Lendi',
      rest: 'is where I learned the building, the leading, and the unbuilding.'
    },
    intro:
      'Most "AI managers" arrive at AI from outside the company. I arrived from inside - eight and a half years of shipping the product, leading the team, and watching what actually breaks. That history is the leverage.',
    pride:
      "The part I'm especially proud of: helping scale Lendi from a startup into Poland's #1 broker and the fastest-growing broker in Europe.",
    phases: [
      {
        year: '2017',
        label: 'Joined Lendi',
        description: 'Vue/Nuxt developer. Frontend on B2B and B2C surfaces.',
        ordinal: '01'
      },
      {
        year: '2020',
        label: 'Frontend Lead',
        description: 'Owned the front-end stack. Mentored juniors. Nuxt 2 -> 3 from alpha.',
        ordinal: '04'
      },
      {
        year: '2023',
        label: 'R&D',
        description:
          'One year off the product, on the future. AI prototypes, internal tools, the company-wide case.',
        ordinal: '07'
      },
      {
        year: '2024',
        label: 'AI Manager & Builder',
        description: 'Lead AI adoption company-wide. Redefine the engineering function.',
        ordinal: '08+'
      }
    ],
    pillars: [
      {
        number: '01',
        heading: 'Adoption',
        line: 'I roll AI into the seams of the company.',
        bullets: [
          'Internal copilots in product, eng, ops',
          'Agentic workflows that replace coordination meetings',
          'Tooling that ships, not slides that pitch'
        ]
      },
      {
        number: '02',
        heading: 'Redefinition',
        line: 'I move engineers from tickets to outcomes.',
        bullets: [
          'Product-builder competency model',
          'Smaller pods, larger surface, faster loops',
          'Performance shifted from velocity to ownership'
        ]
      },
      {
        number: '03',
        heading: 'Optimisation',
        line: "I find the 30% of work AI eats first - and don't pretend it's augmentation.",
        bullets: ['Replace rituals before tools', 'Audit work, not seats', 'Compounding wins beat hero deployments']
      }
    ],
    quote:
      "If your AI strategy lives in one department, you're already behind. The work is to redefine the unit - not the tool.",
    quoteMeta: 'INTERNAL MEMO · LENDI · 2025'
  },
  jasne: {
    label: '§ 03 · jasne.ai',
    sub: 'Case study · 2024 →',
    name: 'jasne.ai',
    intro:
      "A vertical AI product I'm building end-to-end - design, code, infra, distribution. The thesis I sell at Lendi, proven on my own time.",
    shotLabel: 'FIG. 03.01 - JASNE.AI · PRODUCT SURFACE',
    shotFooter: ['VERTICAL AI · SOLO BUILD', '2024 → NOW'],
    facts: [
      { label: 'Role', value: 'Founder · solo build' },
      { label: 'Stack', value: 'Next, Vercel AI SDK' },
      { label: 'Models', value: 'Multi-vendor' },
      { label: 'DB', value: 'Vendor-agnostic' },
      { label: 'Status', value: 'Live · iterating' },
      { label: 'Started', value: '2024' }
    ],
    beats: [
      {
        number: '01',
        heading: 'The product is the wrapper',
        description:
          "The model changes every quarter. The product surface - the workflow, the trust, the speed - is what compounds. I optimised for the parts that don't move."
      },
      {
        number: '02',
        heading: 'Solo end-to-end',
        description:
          'Design, code, infra, distribution. Not because I had to - because the loop is the leverage. Anything I delegate slows the loop.'
      },
      {
        number: '03',
        heading: 'Proof of thesis',
        description:
          "I sell 'engineers as product builders' to Lendi. jasne.ai is me being the product builder. If it didn't work, I'd know."
      }
    ]
  },
  principles: {
    label: '§ 04 · Principles',
    sub: 'Four beliefs, hard-earned',
    heading: "The opinions I'd defend in a room full of people who disagree.",
    items: [
      {
        number: '01',
        heading: 'Programmers become product builders',
        description:
          "AI collapses the distance between idea and shipped feature. The job stops being 'write code' and becomes 'own outcomes'. That's my main KPI at Lendi."
      },
      {
        number: '02',
        heading: 'Vendor-agnostic by default',
        description:
          'Models, vector stores, infra - all swappable. Bet on interfaces, not providers. The wrapper is the product; the model is a commodity.'
      },
      {
        number: '03',
        heading: "Replace, don't augment",
        description:
          "When AI eats 30% of a workflow, the move is to redesign the workflow - not wedge AI into the gaps. I redefine departments, not toolchains."
      },
      {
        number: '04',
        heading: 'Ship beats slides',
        description:
          "An adoption strategy that doesn't end in a deployed tool is a strategy that didn't happen. The deck is a side-effect, not the artefact."
      }
    ]
  },
  stack: {
    label: '§ 05 · Daily stack',
    sub: 'Tools, not religion',
    heading:
      "I'm vendor-agnostic on principle. The abstractions move faster than the providers - and the providers know it.",
    groups: [
      { label: 'Daily', items: ['Claude', 'Codex', 'Cursor', 'Superset'] },
      { label: 'Build', items: ['Vercel AI SDK', 'Next.js', 'Nuxt', 'TypeScript'] },
      { label: 'Posture', items: ['Vendor-agnostic', 'Interface-first', 'Replace > augment'] }
    ]
  },
  track: {
    label: '§ 06 · Track record',
    sub: '11 years · two companies',
    heading: 'Long arcs over loud titles. I stayed where the work compounded.',
    experience: [
      {
        year: '2024 → now',
        role: 'AI Manager & Builder',
        org: 'Lendi',
        description:
          'Lead AI adoption company-wide. Redefine engineering function around the product-builder model. Ship internal tooling, agentic workflows, and the cultural shift that makes them stick.'
      },
      {
        year: '2024 → now',
        role: 'Founder',
        org: 'jasne.ai',
        description:
          'Vertical AI product. Solo end-to-end: design, code, infra, distribution. Vendor-agnostic stack on Vercel AI SDK.'
      },
      {
        year: '2023 - 2024',
        role: 'R&D',
        org: 'Lendi',
        description:
          'One year exploring AI as the next platform. Prototypes, internal tools, the case for company-wide adoption. The bridge between frontend lead and AI manager.'
      },
      {
        year: '2017 - 2023',
        role: 'Frontend Developer -> Lead',
        org: 'Lendi',
        description:
          "Seven years on Lendi's product. Started as Vue/Nuxt developer, grew into front-end lead. Shipped Nuxt 2/3 from alpha, mentored juniors, owned the front-end stack across B2B and B2C surfaces."
      },
      {
        year: '2015 - 2017',
        role: 'Frontend Developer',
        org: 'Finpack',
        description:
          'B2B financial calculators on Vue and Angular. Where I learned how much UI sits between a financial product and a customer.'
      }
    ],
    education: {
      field: 'Automation & Robotics',
      school: 'West Pomeranian University of Technology'
    }
  },
  interests: {
    label: '§ 07 · Current interests',
    sub: 'Exploration · 2026',
    heading:
      "The current edge I'm studying: when models stop being chat boxes and start becoming product surfaces.",
    note: 'Pulled from the same thread as the PostHog page: AI-to-UI, tool access, realtime context, and model-native interfaces.',
    items: [
      {
        number: '01',
        title: 'MCP apps',
        description:
          'Applications where model context, tools, and operational systems are exposed as a native product surface instead of hidden behind a prompt.',
        tag: 'Tooling'
      },
      {
        number: '02',
        title: 'Generative UI',
        description:
          "Interfaces that assemble around the user's intent, data, and task instead of forcing every workflow through static screens.",
        tag: 'AI-to-UI'
      },
      {
        number: '03',
        title: 'Realtime APIs',
        description:
          'Gemini Live, GPT Realtime, voice loops, multimodal streams, and the product patterns that appear when latency drops low enough to feel conversational.',
        tag: 'Live UX'
      },
      {
        number: '04',
        title: 'Omni models, image-to-3D, Gaussian splats',
        description:
          'The jump from text and image generation into spatial assets, 3D capture, editable scenes, and product workflows built around generated reality.',
        tag: 'Spatial AI'
      },
      {
        number: '05',
        title: 'LLM-based OSes',
        description:
          'Operating systems and workspaces where the model is not an app inside the environment, but the layer that routes intent, memory, files, tools, and actions.',
        tag: 'Systems'
      }
    ]
  },
  contact: {
    label: "§ 08 · Let's talk",
    heading: {
      first: "If you're building something",
      accent: 'serious',
      last: 'with AI, I want to hear about it.'
    },
    copy:
      'Best for: Head of AI / AI Lead roles, founding AI engineer at a serious team, or a clear mandate to redefine an engineering function. Worst for: "we want a chatbot."',
    footer: ['© KONRAD STRASZEWSKI · 2026', 'VENDOR-AGNOSTIC BY DESIGN', 'END OF FILE · 08 / 08']
  },
  cv: {
    title: 'CV',
    headline: 'Product-minded AI leader who still ships the interface.',
    subhead:
      'A compact version of the same profile: Lendi, jasne.ai, AI adoption, product-builder operating model, and the stack I use to ship.',
    summary:
      'AI Manager & Builder with 11 years across product engineering and AI adoption. I spent 8.5 years inside Lendi, moving from Vue/Nuxt frontend developer to frontend lead, R&D, and now AI Manager. My work is practical: define the operating model, build the tools, ship product surfaces, instrument the loop, and make the change visible in how teams work.',
    highlights: [
      "Helped scale Lendi from a startup into Poland's #1 broker and the fastest-growing broker in Europe.",
      'Lead company-wide AI adoption: strategy, tooling, training, KPIs, and production workflows.',
      'Built jasne.ai as a solo vertical AI product across design, code, infra, and distribution.',
      'Focused on AI-to-UI, generative interfaces, MCP apps, and vendor-agnostic product architecture.'
    ],
    downloads: [
      {
        label: 'Ogólne CV',
        description: 'PDF w stylu głównej strony',
        href: '/api/cv/general.pdf'
      },
      {
        label: 'PostHog style',
        description: 'PDF w stylu podstrony PostHog',
        href: '/api/cv/posthog.pdf'
      }
    ]
  },
  posthog: {
    title: 'Konrad Straszewski for PostHog Product Engineer',
    description:
      'A PostHog-inspired product pitch from Konrad Straszewski for the Product Engineer role, focused on AI-native UI, product ownership, and shipping loops.',
    hero: {
      kicker: 'Application page / Product Engineer',
      headline: 'I build product surfaces where AI turns intent into shipped UI.',
      lead:
        'I am applying to PostHog because the role reads like the kind of engineering I care about: talk to users, ship the product, instrument the truth, write the docs, support the thing in production, and keep the loop tight.'
    },
    panel: {
      file: 'candidate.fit',
      scoreLabel: 'Role match',
      scoreValue: 'Product Engineer',
      facts: [
        { label: 'Current focus', value: 'AI-to-UI, generative UI, MCP apps' },
        { label: 'Operating mode', value: 'Prototype -> ship -> instrument -> learn' },
        { label: 'Bias', value: 'Useful product over polished theater' }
      ]
    },
    fit: {
      kicker: 'Why PostHog',
      heading: 'The job description sounds like a product operating system.',
      cards: [
        {
          index: '01',
          heading: 'End-to-end ownership',
          description:
            'I like the whole loop: define the problem, design the interaction, write the code, ship the release, watch the data, talk to users, and fix what breaks.'
        },
        {
          index: '02',
          heading: 'User contact as a feature',
          description:
            'The best product decisions I have made came from proximity to messy workflows, not from clean assumptions. I want more of that, not less.'
        },
        {
          index: '03',
          heading: 'AI-native product thinking',
          description:
            'I am interested in interfaces that are generated around intent, context, and tool access instead of frozen around static screens.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can build, scale, and keep product work grounded.',
      rows: [
        {
          label: 'Lendi',
          heading: "Scaled from startup to the #1 broker in Poland and the fastest-growing broker in Europe.",
          description: 'Product, engineering, AI adoption, org-level change, real business pressure.'
        },
        {
          label: 'jasne.ai',
          heading: 'Built a vertical AI product end-to-end.',
          description: 'Solo product work across UX, engineering, positioning, systems, and iteration.'
        },
        {
          label: 'AI Manager',
          heading: 'Moved AI from hype into operating practice.',
          description: 'Tooling, training, adoption loops, KPIs, and pragmatic implementation.'
        },
        {
          label: 'Vue / Nuxt',
          heading: 'Comfortable building product surfaces in the stack this page runs on.',
          description: 'Fast frontend iteration, component systems, deployment discipline, and product polish.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'A tight loop beats a large plan.',
      steps: [
        { label: 'Talk', description: 'Start with users and support context before inventing the answer.' },
        { label: 'Prototype', description: 'Make the interaction concrete enough to create disagreement.' },
        { label: 'Ship', description: 'Release the smallest useful version with clear instrumentation.' },
        { label: 'Dogfood', description: 'Use the thing, write the docs, handle feedback, and keep improving it.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'AI features that feel like product, not decoration.',
      file: 'posthog/product-ideas.md',
      items: [
        {
          label: 'Generative UI for analysis',
          description:
            "let the interface reshape itself around the user's question, funnel, cohort, workflow, or debugging context."
        },
        {
          label: 'MCP-powered product actions',
          description:
            'connect PostHog insight to real operational systems so users can move from analysis to action without losing context.'
        },
        {
          label: 'Workflow automation with feedback loops',
          description: 'make automation observable, editable, and measurable by default.'
        },
        {
          label: 'AI that explains the product',
          description: 'docs, support, and product surfaces that teach users while they work.'
        }
      ]
    },
    contactHeading: 'If this is the kind of product engineering PostHog wants, we should talk.'
  }
} as const
