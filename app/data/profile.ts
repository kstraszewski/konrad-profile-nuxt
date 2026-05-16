export const profile = {
  person: {
    name: 'Konrad Straszewski',
    initials: 'KS',
    role: 'AI Manager & Builder',
    currentRole: 'AI Manager · Lendi',
    location: 'Szczecin, Poland',
    availability: 'Available · senior AI roles · remote',
    openTo: 'Building products',
    stackPosture: 'PostgreSQL, Redis, vendor-agnostic',
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
    },
    mcp: {
      label: 'MCP',
      value: 'Talk to my CV',
      href: '/mcp'
    },
    maf: {
      label: 'MAF',
      value: 'majidalfuttaim.com',
      href: 'https://www.majidalfuttaim.com/#Home',
      external: true
    }
  },
  nav: {
    main: [
      { label: 'Now', href: '#now' },
      { label: 'Principles', href: '#principles' },
      { label: 'Tech', href: '#technologies' },
      { label: 'Track records', href: '#track' },
      { label: 'Interest', href: '#interests' },
      { label: 'Contact', href: '#contact' }
    ],
    posthog: [
      { label: 'Use', href: '#posthog-use' },
      { label: 'Fit', href: '#fit' },
      { label: 'Proof', href: '#proof' },
      { label: 'Ideas', href: '#ideas' },
      { label: 'MCP', href: '/mcp' },
      { label: 'Contact', href: '#contact' }
    ],
    rolePitch: [
      { label: 'Use', href: '#role-use' },
      { label: 'Fit', href: '#fit' },
      { label: 'Proof', href: '#proof' },
      { label: 'Ideas', href: '#ideas' },
      { label: 'MCP', href: '/mcp' },
      { label: 'Contact', href: '#contact' }
    ]
  },
  hero: {
    eyebrow: 'Available · senior AI roles · remote',
    meta: 'EST. 2017 - LENDI · 2023 → AI',
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
      sideBuild: 'jasne.ai',
      mafLead: 'In 2024 I also collaborated with',
      mafCompany: 'MAF',
      mafRest: ', a Dubai mall network, on retrieval-heavy AI.'
    },
    facts: [
      { label: 'Currently', value: 'AI Manager · Lendi' },
      { label: 'Side build', value: 'jasne.ai' },
      { label: 'Based', value: 'Szczecin, Poland' },
      { label: 'Open to', value: 'Building products' },
      { label: 'Stack', value: 'PostgreSQL · Redis · AI product stack' }
    ],
    marquee: [
      { text: 'AI Manager', strong: true },
      { text: 'Builder of jasne.ai', italicWord: 'jasne.ai' },
      { text: '8.5 yrs at Lendi', strong: true },
      { text: '2024 MAF vector search at scale', strong: true },
      { text: 'Products · workflows · distribution' },
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
          'A vertical AI product built end-to-end across product, UX, code, infra, AI integration, and distribution. The proof that the model I sell at Lendi works in the wild.',
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
      'Most "AI managers" arrive at AI from outside the company. I arrived from inside - eight and a half years of shipping the product, leading an 8-person team, and watching what actually breaks. That history is the leverage.',
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
        description: 'Owned the front-end stack. Led an 8-person frontend team. Nuxt 2 -> 3 from alpha.',
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
    shotFooter: ['VERTICAL AI · 0→1 PRODUCT', '2024 → NOW'],
    facts: [
      { label: 'Role', value: 'Founder + Product lead' },
      { label: 'Stack', value: 'Expo, Nuxt, Vercel AI SDK' },
      { label: 'Models', value: 'Gemini' },
      { label: 'DB', value: 'PostgreSQL / Supabase' },
      { label: 'Status', value: 'Live · iterating' },
      { label: 'Started', value: '2024' }
    ],
    beats: [
      {
        number: '01',
        heading: 'Execution got cheap',
        description:
          'The old rule was: ideas are free, execution is the moat. AI breaks that too. Building is getting cheaper; the scarce work is knowing what should exist, for whom, and why it spreads.'
      },
      {
        number: '02',
        heading: 'Distribution is the product',
        description:
          'jasne.ai exists to help companies turn product truth into distribution: sharper positioning, faster campaigns, stronger proof, and tighter loops between product and market.'
      },
      {
        number: '03',
        heading: 'Human influence is the moat',
        description:
          'In the next few years, the unique value of human influence - taste, trust, credibility, relationships, point of view - becomes the scarce layer. jasne.ai is built to amplify it.'
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
        heading: 'Workflow is the moat',
        description:
          'Business logic stops being trapped inside the product. When interfaces can be generated and rewired, the valuable layer is the workflow: context, decisions, proof, distribution, and the loop around them.'
      },
      {
        number: '03',
        heading: 'AI reprices the problem',
        description:
          'Whole departments used to form because a problem was expensive to solve. AI changes the price of that problem, often drastically. Roles will change because the old org shape stops matching the new cost.'
      },
      {
        number: '04',
        heading: 'Vendor lock-in got cheaper',
        description:
          "I still prefer vendor-agnostic systems. Knowing PostgreSQL directly matters here: if Supabase or Neon stops fitting, migration is a product decision, not a company trauma."
      }
    ]
  },
  stack: {
    label: '§ 05 · Technologies',
    sub: 'Current build surface',
    heading:
      'The technologies I reach for when the work is product, AI, and data-heavy interfaces.',
    technologies: [
      'Nuxt',
      'Vue',
      'Expo',
      'Supabase',
      'PostgreSQL',
      'Redis',
      'AI SDK',
      'PostHog',
      'Neon',
      'LangChain',
      'OpenClaw',
      'MCP Apps',
      'Gemini SDK',
      'OpenAI SDK'
    ]
  },
  track: {
    label: '§ 06 · Track record',
    sub: '11 years · product, AI, retrieval',
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
        year: '2024',
        role: 'AI retrieval collaboration',
        org: 'MAF · Dubai mall network',
        description:
          'In 2024, collaborated with MAF, a Dubai-based shopping mall network, on vector search across large-scale data and knowledge bases, retrieval workflows, and practical AI surfaces for operational context.'
      },
      {
        year: '2024 → now',
        role: 'Founder',
        org: 'jasne.ai',
        description:
          'Vertical AI product: design, code, infra, distribution. Vendor-agnostic stack on Vercel AI SDK.'
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
          "Seven years on Lendi's product. Started as Vue/Nuxt developer, grew into front-end lead, and led an 8-person frontend team. Shipped Nuxt 2/3 from alpha and owned the front-end stack across B2B and B2C surfaces."
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
    note: 'Pulled from the same thread as the PostHog page: AI-to-UI, XR, tool access, sandboxed agents, realtime context, and model-native interfaces.',
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
        title: 'XR as a product surface',
        description:
          'Interfaces that move from screens into spatial context: planning, training, support, sales, and field workflows where the environment becomes part of the product.',
        tag: 'XR'
      },
      {
        number: '06',
        title: 'Autonomous agents in sandboxes',
        description:
          'Agents that can plan, execute, test, and recover inside isolated workspaces: enough freedom to do real work, enough containment to keep systems observable and safe.',
        tag: 'Agents'
      },
      {
        number: '07',
        title: 'LLM-based OSes',
        description:
          'Operating systems and workspaces where the model is not an app inside the environment, but the layer that routes intent, memory, files, tools, and actions.',
        tag: 'Systems'
      }
    ]
  },
  about: {
    label: '§ 08 · About',
    sub: 'Outside the work',
    heading: 'I try to stay useful, grounded, and decent while building hard things.',
    copy:
      'The work matters, but so does how I show up around it. I try to be a decent person: direct, fair, reliable, and useful to the people building with me.',
    items: [
      {
        label: 'Boxing',
        value: 'I train boxing. It keeps the feedback loop immediate: discipline, composure, humility, and no room for pretending.'
      },
      {
        label: 'Automotive',
        value: 'I follow cars through engineering, design, culture, and the feel of well-built machines.'
      },
      {
        label: 'Technology',
        value: 'I follow new interfaces, infrastructure, AI systems, XR, and the tools that change how products get built.'
      },
      {
        label: 'Science',
        value: 'I like scientific thinking: models, evidence, systems, and changing your mind when reality disagrees.'
      }
    ]
  },
  contact: {
    label: "§ 09 · Let's talk",
    heading: {
      first: "If you're building something",
      accent: 'serious',
      last: 'with AI, I want to hear about it.'
    },
    copy:
      'Best for: building serious products with AI - new product surfaces, workflow redesign, distribution loops, and teams that want to ship the thing. Worst for: "we want a chatbot."',
    footer: ['© KONRAD STRASZEWSKI · 2026', 'PRODUCTS · WORKFLOWS · DISTRIBUTION', 'END OF FILE · 09 / 09']
  },
  cv: {
    title: 'CV',
    headline: 'Product engineer and AI-native builder who still ships the interface.',
    subhead:
      'A focused product-engineering CV: product ownership, AI-native building, PostgreSQL, Redis, PostHog practice, jasne.ai, and the stack I use to ship.',
    summary:
      'Product Engineer and AI-native builder with 11 years across product engineering, frontend leadership, and AI adoption. I spent 8.5 years inside Lendi, moving from Vue/Nuxt developer to frontend lead, R&D, and now AI Manager. My work is practical: own the product surface, build the tool, shape PostgreSQL/Redis-backed data flows, instrument the loop, write the context, and keep iterating with users and teams.',
    highlights: [
      "Helped scale Lendi from a startup into Poland's #1 broker and the fastest-growing broker in Europe.",
      'Progressed from frontend developer to lead, R&D, and AI Manager while staying close to product surfaces, UX, tooling, and shipping.',
      'Lead practical AI adoption at Lendi: strategy, tooling, training, KPIs, production workflows, and the product-builder operating model.',
      'Implemented PostHog in two organizations, used PostHog MCP heavily, and advocated for evidence-first product loops.',
      'Strong with PostgreSQL and Redis: product data modeling, queryable workflows, caching, queues, and runtime state around real product surfaces.',
      'Built jasne.ai as a 0->1 vertical AI product across product, UX, code, infra, AI integration, and distribution.',
      'Based in Szczecin, Poland (GMT+2), inside PostHog timezone range; strong async writing, docs, and product-context habits.'
    ],
    downloads: [
      {
        label: 'Ogólne CV',
        description: 'PDF w stylu głównej strony',
        href: '/api/cv/general.pdf'
      },
      {
        label: 'PostHog Product Engineer',
        description: 'PDF pod product engineering, PostHog, PostgreSQL/Redis i AI-native loops',
        href: '/api/cv/posthog-pe.pdf'
      },
      {
        label: 'PostHog Product Manager',
        description: 'PDF pod PM ex-founder / ex-product engineer, product data i PostgreSQL/Redis context',
        href: '/api/cv/posthog-pm.pdf'
      },
      {
        label: 'PostHog AI Research Engineer',
        description: 'PDF pod applied AI, product data, PostgreSQL/Redis i research loops',
        href: '/api/cv/posthog-ai-research.pdf'
      },
      {
        label: 'Linear Senior Fullstack Engineer',
        description: 'PDF w spokojnym stylu Linear pod full-stack product engineering, PostgreSQL i Redis',
        href: '/api/cv/linear-fullstack-engineer.pdf'
      },
      {
        label: 'Medusa Product Engineer',
        description: 'PDF w aktualnym stylu Medusa pod production systems, PostgreSQL/Redis, open-source commerce i AI workflows',
        href: '/api/cv/medusa-product-engineer.pdf'
      },
      {
        label: 'n8n Sr AI Engineer',
        description: 'PDF pod AI orchestration, agents, Claude/Codex workflows, PostgreSQL/Redis i TS/Vue/Node',
        href: '/api/cv/n8n-ai-engineer.pdf'
      },
      {
        label: 'n8n Senior Product Engineer',
        description: 'PDF pod Product Engineer TS/Node/Vue, PostgreSQL/Redis i open workflow orchestration',
        href: '/api/cv/n8n-product-engineer.pdf'
      },
      {
        label: 'Plain Senior Product Engineer AI',
        description: 'PDF pod AI support workflows, product ownership, customer context i AI platform work',
        href: '/api/cv/plain-ai-product-engineer.pdf'
      },
      {
        label: 'Polar Senior Product Engineer',
        description: 'PDF pod billing, analytics, applied AI startups, product systems i PostgreSQL/Redis',
        href: '/api/cv/polar-senior-product-engineer.pdf'
      },
      {
        label: 'Lago Product Engineer Growth',
        description: 'PDF pod AI agents for GTM, multi-agent workflows, evals i open-source billing context',
        href: '/api/cv/lago-product-engineer-growth.pdf'
      }
    ]
  },
  posthog: {
    title: 'Konrad Straszewski for PostHog Product Engineer',
    description:
      'A PostHog-inspired product pitch from Konrad Straszewski for the Product Engineer role: ownership, users, docs, support, shipping, and AI-native product loops.',
    hero: {
      kicker: 'Application page / Product Engineer',
      headline: 'I build the product, instrument the truth, then keep shipping.',
      lead:
        'I care about the loop PostHog describes: originate the idea, talk to users, ship the MVP, instrument the truth, write docs, support production, and iterate.'
    },
    panel: {
      file: 'candidate.fit',
      scoreLabel: 'Role match',
      scoreValue: 'Product Engineer + AI builder',
      pizzaBadge: {
        question: 'Does pineapple belong on pizza?',
        percent: '100%',
        answer: 'YES'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - GMT+2' },
        { label: 'Mode', value: 'Prototype -> ship -> instrument -> learn' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Bias', value: 'Useful product over polished theater' }
      ]
    },
    relationship: {
      kicker: 'PostHog in practice',
      heading: 'I already work in PostHog-shaped loops.',
      copy:
        'I have implemented PostHog in two organizations, used the MCP heavily, and spent more than a year pushing teams from narrative-first product decisions into shared evidence. The appeal is simple: PostHog turns product work into a tighter loop between user behavior, engineering decisions, support context, and what ships next.',
      cards: [
        {
          label: '2 orgs',
          title: 'Rolled into real teams',
          description:
            'I have rolled PostHog into two organizations as an operating surface for product and engineering, not as a dashboard that sits outside the work.'
        },
        {
          label: 'MCP',
          title: 'Used as workflow input',
          description:
            'I have used PostHog through MCP to pull product context into real workflows: asking questions, reading behavior, and shortening the path from insight to action.'
        },
        {
          label: '1+ year',
          title: 'Advocated evidence',
          description:
            'For over a year I have been the person pushing conversations toward funnels, cohorts, recordings, feature flags, and observable product evidence.'
        },
        {
          label: 'PO work',
          title: 'Changed product habits',
          description:
            'The useful change was behavioral: Product Owners and engineers could argue from what users actually did, then decide faster and iterate cleaner.'
        }
      ]
    },
    fit: {
      kicker: 'Why PostHog',
      heading: 'The role reads like a product operating system. That is the job I want.',
      cards: [
        {
          index: '01',
          heading: 'Own the work end to end',
          description:
            'The part I like is the full loop: choose the problem, design the basic UX, write the code, ship the release, read the data, talk to users, price the tradeoffs, and fix what breaks.'
        },
        {
          index: '02',
          heading: 'Users are part of the build system',
          description:
            'The best product decisions I have made came from proximity to messy workflows, support context, and real behavior. I want more of that, not a cleaner layer of assumptions.'
        },
        {
          index: '03',
          heading: 'AI-native without theater',
          description:
            'I care about AI when it changes the product surface: generated UI, workflow automation, retrieval, tool access, and faster loops between question, evidence, and action.'
        },
        {
          index: '04',
          heading: 'Writing and docs are shipping',
          description:
            'I write notes, specs, internal memos, and product context because async teams need durable thinking. The person who builds the feature should be able to explain it.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can build, own, explain, and keep the product grounded.',
      rows: [
        {
          label: '8.5 yrs / Lendi',
          heading: 'Grew from frontend developer to lead, R&D, and AI Manager inside one product company.',
          description:
            'Long-term ownership across B2B/B2C financial product surfaces, mentoring, frontend stack decisions, AI prototypes, and org-level adoption.'
        },
        {
          label: '0->1 / jasne.ai',
          heading: 'Built a vertical AI product end-to-end from product strategy to shipped implementation.',
          description:
            'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration without a handoff between builder and owner.'
        },
        {
          label: 'AI adoption',
          heading: 'Moved AI from hype into operating practice.',
          description:
            'Company-wide adoption work: tooling, training, workflows, KPIs, internal copilots, and redefining engineering from tickets toward outcomes.'
        },
        {
          label: 'PostHog',
          heading: 'Used PostHog as a product operating surface, not a reporting afterthought.',
          description:
            'Two implementations, heavy MCP usage, internal advocacy, and a practical bias toward funnels, cohorts, recordings, flags, and fast questions.'
        },
        {
          label: 'MAF / retrieval',
          heading: 'Collaborated on retrieval-heavy AI for a Dubai shopping mall network.',
          description:
            'Vector search, large knowledge bases, operational context, and practical AI delivery for complex real-world data.'
        },
        {
          label: 'Stack',
          heading: 'TypeScript product engineer with enough full-stack range to own the loop.',
          description:
            'Vue/Nuxt, Expo, PostgreSQL, Redis, Supabase, SQL/data flows, Vercel AI SDK, Gemini/OpenAI, LangChain, PostHog, deployment, instrumentation, and product UX.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'A tight product loop beats a perfect plan.',
      steps: [
        { label: 'Read', description: 'Start with user feedback, support context, recordings, data, and the strategy around the product.' },
        { label: 'Shape', description: 'Turn the problem into a concrete interaction, workflow, or thin MVP that can create useful disagreement.' },
        { label: 'Ship', description: 'Release the smallest useful version with clear instrumentation, visible docs, and a support path.' },
        { label: 'Loop', description: 'Dogfood it, talk to users, watch the evidence, fix what breaks, and keep the product moving.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'AI ideas I would want to test with real PostHog users.',
      file: 'posthog/product-ideas.md',
      items: [
        {
          label: 'Generative UI for analysis',
          description:
            "let the interface reshape itself around the user's question, funnel, cohort, workflow, or debugging context instead of forcing every answer into a fixed screen."
        },
        {
          label: 'MCP-powered product actions',
          description:
            'connect PostHog insight to operational systems so users can move from analysis to action without losing product context.'
        },
        {
          label: 'Workflow debugger',
          description:
            'for the Workflows team: make event delivery, campaigns, and automations inspectable as timelines with clear failure reasons and suggested fixes.'
        },
        {
          label: 'Docs from the support loop',
          description:
            'turn repeated support investigations, recordings, and user confusion into docs and product affordances that teach users while they work.'
        }
      ]
    },
    contactHeading: 'If this is the kind of product engineering PostHog wants, we should talk.'
  },
  posthogPm: {
    title: 'Konrad Straszewski for PostHog Product Manager',
    description:
      'A PostHog-inspired product pitch from Konrad Straszewski for the Product Manager ex-founder or ex-product engineer role: research, data, users, commercial context, and coaching product engineers.',
    hero: {
      kicker: 'Application page / Product Manager',
      headline: 'I turn users, data, and commercial context into better product bets.',
      lead:
        'Builder background; PM focus: growth reviews, data research, user interviews, competitive context, and coaching engineers.'
    },
    panel: {
      file: 'candidate.pm-fit',
      scoreLabel: 'Role match',
      scoreValue: 'PM + ex-product engineer',
      pizzaBadge: {
        question: 'Does pineapple belong on pizza?',
        percent: '100%',
        answer: 'YES'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - GMT+2' },
        { label: 'Mode', value: 'Research -> data -> users -> context -> bets' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Bias', value: 'Commercial truth over product theater' }
      ]
    },
    relationship: {
      kicker: 'PostHog in practice',
      heading: 'I already use PostHog the way this PM role works.',
      copy:
        'I have implemented PostHog in two organizations, used the MCP heavily, and pushed teams toward shared evidence. That maps directly to the PM shape PostHog describes: understand behavior, ask better questions, interview users, and give engineers context instead of tickets.',
      cards: [
        {
          label: '2 orgs',
          title: 'Implemented in product teams',
          description:
            'Rolled PostHog into real teams as a way to make product decisions from user behavior, funnels, recordings, and feature flags.'
        },
        {
          label: 'MCP',
          title: 'Used data in workflows',
          description:
            'Used PostHog MCP to pull product context into working loops instead of treating analytics as a dashboard outside the product conversation.'
        },
        {
          label: 'PM loop',
          title: 'Helped teams ask better questions',
          description:
            'Moved conversations from narrative-first to evidence-first: what changed, who churned, what users actually did, and what should we learn next?'
        },
        {
          label: 'Founder',
          title: 'Built and positioned jasne.ai',
          description:
            'As jasne.ai founder, I own the messy product work too: target user, problem shape, positioning, distribution, pricing questions, and iteration.'
        }
      ]
    },
    fit: {
      kicker: 'Why this PM role',
      heading: 'I want to help product engineers make better bets, not manage their backlog.',
      cards: [
        {
          index: '01',
          heading: 'Research and data before opinion',
          description:
            'I like product work when the question is not obvious: segment users, read behavior, talk to customers, compare alternatives, and decide what needs deeper research.'
        },
        {
          index: '02',
          heading: 'Commercial context matters',
          description:
            'The useful PM work is not only UX taste. It is understanding retention, churn, pricing, packaging, competitors, and where the product has untapped leverage.'
        },
        {
          index: '03',
          heading: 'Ex-builder empathy',
          description:
            'I have shipped the interfaces and lived inside engineering tradeoffs. That makes me useful as a PM who gives context, feedback, and product coaching without turning into a project manager.'
        },
        {
          index: '04',
          heading: 'Async product clarity',
          description:
            'I write memos, notes, product context, and decision framing because distributed teams need durable thinking and crisp recommendations.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Research, data, commercial context, and ex-builder judgment.',
      rows: [
        {
          label: 'Ex-builder',
          heading: '11 years in product engineering, frontend leadership, R&D, and AI adoption.',
          description:
            'I know how product engineering actually works because I have owned product surfaces, mentoring, stack decisions, prototypes, and delivery pressure.'
        },
        {
          label: 'PostHog',
          heading: 'Implemented PostHog in two organizations and used it as a product operating surface.',
          description:
            'Funnels, cohorts, recordings, feature flags, MCP workflows, and evidence-first product conversations with product and engineering teams.'
        },
        {
          label: 'Growth loops',
          heading: 'Led practical adoption work with KPIs, training, workflows, and visible behavior change.',
          description:
            'AI adoption at Lendi required product sense, stakeholder context, workflow analysis, measurement, and helping teams change how they work.'
        },
        {
          label: 'Founder',
          heading: 'Built jasne.ai as a 0->1 product, including positioning and distribution.',
          description:
            'A 0->1 founder track across problem discovery, UX, product narrative, code, AI integration, infrastructure, and market loops.'
        },
        {
          label: 'AI product',
          heading: 'Worked on AI products, retrieval-heavy systems, and AI-native product surfaces.',
          description:
            'jasne.ai, Lendi AI workflows, and MAF retrieval work map well to PostHog AI, data products, workflow, support, and CRM ambitions.'
        },
        {
          label: 'SQL / data',
          heading: 'Strong with PostgreSQL, Redis, product data flows, analytics, and instrumentation.',
          description:
            'PostgreSQL, Redis, Supabase, PostHog, SQL/data flows, product instrumentation, cohorts/funnels, and the habit of turning ambiguous questions into queryable ones.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The PM loop I would bring to PostHog.',
      steps: [
        { label: 'Measure', description: 'Read activation, retention, churn, usage, revenue, and where the product story breaks by segment.' },
        { label: 'Interview', description: 'Talk to users, bring engineers in, and connect qualitative friction to observed behavior.' },
        { label: 'Compare', description: 'Map competitors, pricing, packaging, parity, and adjacent product opportunities.' },
        { label: 'Frame', description: 'Turn research into crisp context, recommendations, and product feedback for better bets.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'PM projects I would want to pick up with real PostHog data.',
      file: 'posthog/pm-projects.md',
      items: [
        {
          label: 'Growth review system',
          description:
            'a repeatable monthly readout for one product: activation, retention, churn, expansion, surprising segments, and the next research question.'
        },
        {
          label: 'Retention and churn map',
          description:
            'find which behaviors, integrations, team sizes, and setup paths correlate with long-term retention or early churn.'
        },
        {
          label: 'Packaging and pricing map',
          description:
            'compare PostHog product packaging against incumbents and identify where pricing, limits, or bundling could unlock adoption.'
        },
        {
          label: 'AI analyst research loop',
          description:
            'study PostHog AI questions, failed answers, SQL edits, and support cases to find the next high-leverage product improvements.'
        }
      ]
    },
    contactHeading: 'If PostHog needs a PM who used to build the product, we should talk.'
  },
  posthogAiResearch: {
    title: 'Konrad Straszewski for PostHog AI Research Engineer',
    description:
      'A PostHog-inspired CV variant for the AI Research Engineer role: applied AI systems, retrieval, product data loops, evals, MCP, and AI-native product surfaces.',
    hero: {
      kicker: 'Application page / AI Research Engineer',
      headline: 'I build the product-data loops that make AI systems useful.',
      lead:
        'Applied AI systems fit: retrieval, evals, instrumentation, MCP/tool access, user behavior evidence, and product surfaces around models.'
    },
    panel: {
      file: 'candidate.ai-research-fit',
      scoreLabel: 'Role match',
      scoreValue: 'Applied AI systems + product data',
      pizzaBadge: {
        question: 'Does pineapple belong on pizza?',
        percent: '100%',
        answer: 'YES'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - GMT+1/+2' },
        { label: 'Mode', value: 'Data -> evals -> prototype -> ship -> learn' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Bias', value: 'Research should survive contact with users' }
      ]
    },
    relationship: {
      kicker: 'PostHog AI fit',
      heading: 'The role maps to the edge I am already studying and building around.',
      copy:
        'PostHog describes self-driving product, session replay analysis, user behavior prediction, and synthetic user testing. My strongest fit is the applied AI layer around that: turning product behavior, recordings, events, retrieval, evals, and tool access into systems that can be tested, shipped, and improved with real users.',
      cards: [
        {
          label: 'Replay/data',
          title: 'I understand product behavior loops',
          description:
            'I have used PostHog recordings, funnels, cohorts, and instrumentation as an operating surface for product and engineering decisions.'
        },
        {
          label: 'Retrieval',
          title: 'Worked on large knowledge systems',
          description:
            'Collaborated on retrieval-heavy AI for a Dubai shopping mall network, with vector search, large knowledge bases, and practical operational context.'
        },
        {
          label: 'Agents',
          title: 'Studying sandboxed and tool-using agents',
          description:
            'My current research thread is MCP apps, agent sandboxes, model-native interfaces, realtime context, and AI-to-UI product surfaces.'
        },
        {
          label: 'Shipping',
          title: 'I care about models in the product loop',
          description:
            'The useful question is not only model quality. It is what data it sees, how it is evaluated, how users correct it, and how the product changes.'
        }
      ]
    },
    fit: {
      kicker: 'Why this AI role',
      heading: 'I want to work where AI research meets product behavior at massive scale.',
      cards: [
        {
          index: '01',
          heading: 'Session replay as a learning surface',
          description:
            'PostHog has DOM mutations, recordings, errors, events, and customer context. That is unusually rich material for finding friction, breakage, and intent.'
        },
        {
          index: '02',
          heading: 'Prediction should stay grounded',
          description:
            'Behavior prediction is only useful if it connects back to observed product reality: cohorts, drop-offs, revenue, recordings, and the next user-visible change.'
        },
        {
          index: '03',
          heading: 'Synthetic users are product infrastructure',
          description:
            'If synthetic user testing works, it becomes part of how teams ship. That needs evals, product taste, instrumentation, and feedback loops.'
        },
        {
          index: '04',
          heading: 'Research has to ship',
          description:
            'I am strongest where AI work becomes a system: data, prototype, eval, product surface, support path, and iteration from real usage.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Applied AI, retrieval, product data, and shipping judgment.',
      rows: [
        {
          label: 'AI adoption',
          heading: 'Lead practical AI adoption across a product organization.',
          description:
            'Strategy, tooling, training, KPIs, internal copilots, workflows, and changing how teams actually build with AI.'
        },
        {
          label: 'Retrieval',
          heading: 'Collaborated on retrieval-heavy AI across large knowledge bases.',
          description:
            'Vector search, operational context, large-scale knowledge systems, and real-world AI delivery for MAF in Dubai.'
        },
        {
          label: 'PostHog',
          heading: 'Implemented PostHog and used behavior data as product evidence.',
          description:
            'Funnels, cohorts, recordings, feature flags, MCP workflows, instrumentation, and evidence-first decisions.'
        },
        {
          label: 'AI product',
          heading: 'Built jasne.ai as a 0->1 vertical AI product.',
          description:
            'Product strategy, UX, code, infrastructure, Gemini, Vercel AI SDK, Supabase/PostgreSQL, distribution, and iteration.'
        },
        {
          label: 'Agents',
          heading: 'Focused on MCP apps, sandboxed agents, and AI-native interfaces.',
          description:
            'The same product direction PostHog AI is moving toward: tool access, skills, traces, context, and model-native workflows.'
        },
        {
          label: 'Data / stack',
          heading: 'Strong around PostgreSQL, Redis, instrumentation, and AI SDKs.',
          description:
            'TypeScript, Vue/Nuxt, Expo, PostgreSQL, Redis, Supabase, SQL/data flows, PostHog, LangChain, Gemini/OpenAI SDKs, and product UX.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The AI research loop I would bring.',
      steps: [
        { label: 'Frame', description: 'Start from the product behavior: what users do, where they fail, and what signal could make the product smarter.' },
        { label: 'Instrument', description: 'Make the loop observable with events, recordings, traces, cohorts, and the smallest useful dataset.' },
        { label: 'Evaluate', description: 'Compare outputs against real tasks, edge cases, user corrections, and product-quality thresholds.' },
        { label: 'Ship', description: 'Turn research into a product surface, then keep improving it from usage, support context, and failures.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'AI research directions I would want to test with PostHog data.',
      file: 'posthog/ai-research-notes.md',
      items: [
        {
          label: 'Replay friction model',
          description:
            'learn from DOM mutations, errors, recordings, and events to classify confusing flows, broken states, and likely user intent.'
        },
        {
          label: 'Behavior prediction evals',
          description:
            'build eval sets around drop-offs, activation, conversion, and retention so predictions are judged against product reality.'
        },
        {
          label: 'Synthetic user runs',
          description:
            'simulate critical workflows, compare synthetic behavior to real users, and surface regressions before teams ship.'
        },
        {
          label: 'Model-to-product traces',
          description:
            'connect model outputs, tool calls, user corrections, and product events so AI features improve from real usage.'
        }
      ]
    },
    contactHeading: 'If PostHog wants applied AI research close to product behavior, we should talk.'
  },
  linear: {
    company: 'Linear',
    title: 'Konrad Straszewski for Linear Senior / Staff Fullstack Engineer',
    description:
      'A Linear-tailored product engineering pitch from Konrad Straszewski: end-to-end product ownership, TypeScript product systems, async writing, AI-native workflows, and craft.',
    role: {
      href: 'https://linear.app/careers/cd5ae036-0223-427a-b038-ba16ef9dcb32?ashby_jid=d3bc1ced-3ce4-4086-a050-555055dbb1ff'
    },
    hero: {
      kicker: 'Application page / Senior or Staff Fullstack Engineer',
      headline: 'I build product systems with ownership, speed, and taste.',
      lead:
        'Linear is looking for a self-directed builder who can shape the problem, work across the stack, care about UX and speed, and operate well in a remote async team. That maps closely to how I have grown inside Lendi and how I build jasne.ai.'
    },
    panel: {
      file: 'candidate.linear-fit',
      scoreLabel: 'Role match',
      scoreValue: 'Full-stack product builder',
      badge: {
        label: 'Linear-shaped signal',
        value: 'End-to-end + async',
        description: 'Product judgment, durable writing, UI craft, and enough technical range to own the feature from idea to shipped.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Europe timezone' },
        { label: 'Mode', value: 'Shape -> build -> polish -> learn' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Stack', value: 'TypeScript product surfaces, Nuxt/Vue, PostgreSQL, Redis, AI SDKs' }
      ]
    },
    relationship: {
      kicker: 'Linear in practice',
      heading: 'The role describes the operating mode I want more of.',
      copy:
        'The strongest signal in the Linear role is not a framework checklist. It is the expectation that engineers shape customer-facing product work, push for quality, write clearly, and ship without heavy PM overhead. That is the same direction I have been moving teams toward at Lendi.',
      cards: [
        {
          label: 'Owner',
          title: 'I like whole problems',
          description:
            'The best work I have done was not isolated implementation. It was taking a messy problem, finding the product shape, building the UI and workflow, and staying with it after release.'
        },
        {
          label: 'Craft',
          title: 'I care when the product feels wrong',
          description:
            'Frontend leadership made me sensitive to interaction quality, speed, details, and the difference between something that technically works and something users can trust.'
        },
        {
          label: 'Async',
          title: 'Writing is part of the job',
          description:
            'I write specs, memos, training material, product notes, and decision framing because remote product teams need context that survives the meeting.'
        },
        {
          label: 'Agents',
          title: 'I am building for the AI era of software work',
          description:
            'My current edge is MCP apps, agent workflows, AI-to-UI, generated interfaces, and the shift from ticket execution toward product ownership.'
        }
      ]
    },
    fit: {
      kicker: 'Why Linear',
      heading: 'Linear sits where product craft and AI-era software work collide.',
      cards: [
        {
          index: '01',
          heading: 'Full lifecycle is the point',
          description:
            'I am strongest when the job includes shaping, implementation, product taste, release judgment, and iteration from real usage rather than only moving tickets across a board.'
        },
        {
          index: '02',
          heading: 'High-quality software teams are the user',
          description:
            'A product for builders needs speed, clarity, low friction, and a strong point of view. Those are the details I naturally obsess over.'
        },
        {
          index: '03',
          heading: 'AI changes product development itself',
          description:
            'My work at Lendi is already about this shift: engineers becoming product builders, agents becoming workflow participants, and tooling changing how teams decide and ship.'
        },
        {
          index: '04',
          heading: 'I can bridge UI, data, and workflow',
          description:
            'I come from product surfaces, but my recent work reaches into AI tooling, product analytics, retrieval, internal workflows, and product operating systems.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Signals that I can own customer-facing product work at a high bar.',
      rows: [
        {
          label: '8.5 yrs / Lendi',
          heading: 'Grew from frontend developer to lead, R&D, and AI Manager inside one product company.',
          description:
            'Long-term ownership across B2B/B2C product surfaces, frontend stack decisions, mentoring, prototypes, and org-level AI adoption.'
        },
        {
          label: 'Product craft',
          heading: 'Owned frontend quality across complex financial product surfaces.',
          description:
            'Nuxt/Vue product work taught me to care about speed, clarity, edge cases, user trust, and the operational details around production UI.'
        },
        {
          label: 'AI adoption',
          heading: 'Moved engineering work toward AI-native product ownership.',
          description:
            'Training, tooling, workflows, KPIs, internal copilots, and the operating model that shifts engineers from ticket execution to product outcomes.'
        },
        {
          label: '0->1 / jasne.ai',
          heading: 'Built a vertical AI product end-to-end.',
          description:
            'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration without a handoff between product and engineering.'
        },
        {
          label: 'Data/runtime',
          heading: 'Strong with PostgreSQL, Redis, and observable product data flows.',
          description:
            'PostgreSQL and Redis for product systems, plus PostHog in two organizations, MCP workflows, funnels, cohorts, recordings, flags, and observable product truth.'
        },
        {
          label: 'MAF / retrieval',
          heading: 'Worked around retrieval-heavy AI and large knowledge systems.',
          description:
            'Vector search, operational context, and practical AI delivery for a Dubai shopping mall network.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The Linear-shaped loop I would bring.',
      steps: [
        { label: 'Shape', description: 'Turn a vague problem into a concrete product surface, tradeoff, and first useful release.' },
        { label: 'Build', description: 'Work through UI, state, data flow, and integration details until the feature is real enough to judge.' },
        { label: 'Polish', description: 'Tune interaction quality, latency, copy, empty states, and the details that make serious tools feel dependable.' },
        { label: 'Learn', description: 'Use data, support context, user feedback, and team notes to decide what should change next.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'Product directions I would want to test with Linear users.',
      file: 'linear/product-notes.md',
      items: [
        {
          label: 'Agent-ready product context',
          description:
            'make issues, specs, diffs, customer requests, and decisions easier for agents to read, update, and explain without losing human accountability.'
        },
        {
          label: 'Planning from evidence',
          description:
            'connect roadmap conversations to product signals, customer requests, support context, and the actual shape of shipped work.'
        },
        {
          label: 'Async decision memory',
          description:
            'turn scattered comments, specs, and meeting residue into durable decision trails that help remote teams move faster.'
        },
        {
          label: 'Quality loops for builders',
          description:
            'make the product help teams notice unclear ownership, stale scope, slow handoffs, and broken loops before they become process.'
        }
      ]
    },
    contactHeading: 'If Linear wants a product builder for the agent-native era of software work, we should talk.'
  },
  medusa: {
    company: 'Medusa',
    title: 'Konrad Straszewski for Medusa Product Engineer',
    description:
      'A Medusa-tailored product engineering pitch from Konrad Straszewski: production systems, TypeScript product work, AI-native developer workflows, and end-to-end ownership.',
    role: {
      href: 'https://medusajs.com/careers/product-engineer/'
    },
    hero: {
      kicker: 'Application page / Product Engineer',
      headline: 'I build product systems where code and strategy stay together.',
      lead:
        'Medusa needs a product engineer who can own systems end-to-end, understand users and business context, and help make AI-era commerce faster to build. That fits my path: production-minded product surfaces, AI adoption, jasne.ai, and a bias toward shipping useful systems.'
    },
    panel: {
      file: 'candidate.medusa-fit',
      scoreLabel: 'Role match',
      scoreValue: 'Production systems + AI builder',
      badge: {
        label: 'Medusa-shaped signal',
        value: 'High-agency ownership',
        description: 'Product thinking, AI workflow experience, and a practical feel for systems developers and operators actually want to use.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Europe timezone' },
        { label: 'Mode', value: 'Clear thinking -> right problem -> owned system' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Stack', value: 'TypeScript, Nuxt/Vue, PostgreSQL, Redis, Neon/Supabase, AI SDKs, PostHog' }
      ]
    },
    relationship: {
      kicker: 'Medusa in practice',
      heading: 'The role is about builder leverage, not just commerce.',
      copy:
        'Medusa connects an open-source commerce framework, managed infrastructure, and AI-assisted building. The fit for me is the product-engineering loop: understand the developer or operator, make the abstractions useful, ship the system, and keep the product close to real customer pressure.',
      cards: [
        {
          label: 'OSS',
          title: 'I like products developers can inspect and extend',
          description:
            'Open-source products force stronger primitives, better docs, clearer APIs, and less hand-waving. That is the kind of product pressure I like.'
        },
        {
          label: 'AI',
          title: 'I work where AI changes the product surface',
          description:
            'My current work is about AI in real workflows: tools, agents, MCP apps, retrieval, generated interfaces, and the operating model around them.'
        },
        {
          label: 'Users',
          title: 'Customer context belongs in engineering',
          description:
            'I have spent the last years moving teams away from abstract delivery and toward product evidence, workflow understanding, and ownership.'
        },
        {
          label: '0->1',
          title: 'I can build without handoffs',
          description:
            'jasne.ai is a practical example: product strategy, UX, code, infra, AI integration, and distribution owned in one loop.'
        }
      ]
    },
    fit: {
      kicker: 'Why Medusa',
      heading: 'Commerce is being rebuilt as programmable product infrastructure.',
      cards: [
        {
          index: '01',
          heading: 'System ownership matters',
          description:
            'The interesting work is not another admin panel. It is services, APIs, workflows, and UI that make custom commerce cheaper and safer to build.'
        },
        {
          index: '02',
          heading: 'AI changes implementation cost',
          description:
            'Medusa is explicit about AI making custom software cheaper. That is the same thesis behind my AI adoption work at Lendi.'
        },
        {
          index: '03',
          heading: 'Customers should shape direction',
          description:
            'The role sits close to customers and product strategy. That matches how I like to work: business context, user pressure, and technical direction in the same loop.'
        },
        {
          index: '04',
          heading: 'Small teams need agency',
          description:
            'The role describes a small remote team with high agency. That is where broad product engineering range becomes useful instead of ornamental.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can build product systems close to users and business context.',
      rows: [
        {
          label: 'Lendi scale',
          heading: 'Helped scale production product surfaces in a fast-growing financial company.',
          description:
            "Eight and a half years at Lendi, from frontend developer to lead, R&D, and AI Manager while the company became Poland's #1 broker."
        },
        {
          label: 'B2B/B2C',
          heading: 'Built serious product UI where trust, accuracy, and workflows matter.',
          description:
            'Financial products taught me to respect edge cases, operational context, compliance-adjacent pressure, and user confidence.'
        },
        {
          label: 'AI adoption',
          heading: 'Lead the shift from AI demos to working product and developer workflows.',
          description:
            'Company-wide adoption, training, tooling, internal copilots, workflow redesign, KPIs, and the product-builder operating model.'
        },
        {
          label: 'jasne.ai',
          heading: 'Built and positioned a vertical AI product from zero.',
          description:
            'End-to-end work across product strategy, UX, implementation, infrastructure, model integration, distribution, and iteration.'
        },
        {
          label: 'Data loops',
          heading: 'Use product analytics and behavior evidence as part of building.',
          description:
            'Implemented PostHog, used MCP workflows, and pushed teams toward observable product evidence instead of narrative-only decisions.'
        },
        {
          label: 'AI systems',
          heading: 'Worked around PostgreSQL/Redis-backed product systems, retrieval-heavy AI, and model APIs.',
          description:
            'PostgreSQL, Redis, MAF retrieval collaboration, Gemini/OpenAI SDKs, Vercel AI SDK, Supabase, LangChain, MCP apps, and AI-to-UI exploration.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The Medusa-shaped loop I would bring.',
      steps: [
        { label: 'Understand', description: 'Start from the developer or operator workflow: what they are trying to build, where time disappears, and what abstraction would help.' },
        { label: 'Prioritize', description: 'Pick the problem that matters now, with enough user, business, and technical context to avoid polished distractions.' },
        { label: 'Ship', description: 'Build the first working version, keep scope tight, and make the result observable enough to improve.' },
        { label: 'Compound', description: 'Use customer feedback, product analytics, support context, and internal dogfooding to strengthen the platform.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'Product directions I would want to test with Medusa users.',
      file: 'medusa/product-notes.md',
      items: [
        {
          label: 'AI-assisted commerce setup',
          description:
            'turn catalog, fulfillment, payment, and custom workflow setup into guided agent-assisted flows with explicit review points.'
        },
        {
          label: 'System state timeline',
          description:
            'make orders, inventory, payments, and fulfillment flows inspectable as timelines with clear state, failure reasons, and suggested fixes.'
        },
        {
          label: 'Developer onboarding telemetry',
          description:
            'instrument where developers get stuck across docs, templates, APIs, and deployment so activation work is grounded in evidence.'
        },
        {
          label: 'Customer-shaped admin surfaces',
          description:
            'let teams shape admin workflows around their commerce model instead of forcing every implementation into the same rigid interface.'
        }
      ]
    },
    contactHeading: 'If Medusa needs a product engineer who can build the platform and the workflow around it, we should talk.'
  },
  n8n: {
    company: 'n8n',
    title: 'Konrad Straszewski for n8n AI and Product Engineering',
    description:
      'An n8n-tailored application page for AI orchestration, product engineering, agents, workflow automation, TypeScript/Vue/Node, and AI-native builder work.',
    roles: {
      aiEngineer: {
        href: 'https://jobs.ashbyhq.com/n8n/d195a389-6af5-4b95-82e5-2258953c7297/'
      },
      productEngineer: {
        href: 'https://jobs.ashbyhq.com/n8n/896c58a8-0388-4037-b265-82b15633a568/'
      }
    },
    hero: {
      kicker: 'Application page / Sr AI Engineer + Senior Product Engineer',
      headline: 'I build AI workflows, product surfaces, and the operating habits that make them real.',
      lead:
        'n8n sits exactly where my current work is pointed: workflow orchestration, AI agents, developer-grade automation, and product engineers who use AI tools as leverage without lowering the engineering bar.'
    },
    panel: {
      file: 'candidate.n8n-fit',
      scoreLabel: 'Role match',
      scoreValue: 'AI orchestration builder + TS/Vue product engineer',
      badge: {
        label: 'n8n-shaped signal',
        value: 'AI workflows in production',
        description:
          'I am already working on the shift from isolated AI demos to real company workflows: tools, agents, MCP, product surfaces, and measurable adoption.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Europe remote' },
        { label: 'Stack', value: 'TypeScript, Vue/Nuxt, Node-adjacent systems, PostgreSQL, Redis, Supabase, PostHog, AI SDKs' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Mode', value: 'Prototype -> orchestrate -> ship -> instrument -> improve' }
      ]
    },
    relationship: {
      kicker: 'n8n fit',
      heading: 'The company is building the category I have been moving teams toward.',
      copy:
        'n8n is not just workflow automation. It is the operating layer for technical teams that need code-level flexibility, no-code speed, integrations, and AI-native orchestration. That matches my Lendi work: practical adoption, internal copilots, agents, training, workflows, and turning engineers into product builders.',
      cards: [
        {
          label: 'AI',
          title: 'I make AI operational',
          description:
            'My current job is to move AI from hype into daily work: tooling, training, workflows, internal copilots, adoption KPIs, and production habits.'
        },
        {
          label: 'Flow',
          title: 'I think in workflows',
          description:
            'The useful product question is often not the model. It is the chain of tools, data, approvals, retries, fallbacks, and product UI around it.'
        },
        {
          label: 'Stack',
          title: 'Vue/Nuxt plus data systems',
          description:
            'Seven years of Vue/Nuxt product work plus strong PostgreSQL and Redis range give me a product engineering base without becoming frontend-only.'
        },
        {
          label: 'Builder',
          title: 'I ship without a handoff',
          description:
            'jasne.ai is a 0->1 vertical AI product I own across product strategy, UX, code, infra, AI integration, distribution, and iteration.'
        }
      ]
    },
    fit: {
      kicker: 'Why n8n',
      heading: 'Workflow orchestration is where AI becomes company behavior.',
      cards: [
        {
          index: '01',
          heading: 'AI needs orchestration',
          description:
            'Prompting is not enough. Useful AI products need tools, context, memory, evals, fallbacks, observability, and a workflow surface people can trust.'
        },
        {
          index: '02',
          heading: 'Builders need both code and speed',
          description:
            'n8n is interesting because it gives technical teams a middle path: fast composition without hiding the power and precision builders need.'
        },
        {
          index: '03',
          heading: 'I already coach this transition',
          description:
            'At Lendi, my work is not only building AI artifacts. It is changing how teams decide, build, measure, and use AI-assisted engineering responsibly.'
        },
        {
          index: '04',
          heading: 'Product taste still matters',
          description:
            'AI workflows only stick when the product makes state, confidence, failure, and next action obvious. That is product engineering work, not just backend plumbing.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can build and operationalize AI-native workflow products.',
      rows: [
        {
          label: 'AI adoption',
          heading: 'Lead company-wide AI adoption at Lendi.',
          description:
            'Strategy, tooling, training, workflows, KPIs, internal copilots, and the product-builder operating model for real teams.'
        },
        {
          label: 'Vue/Nuxt',
          heading: 'Grew from Vue/Nuxt developer to frontend lead and AI Manager.',
          description:
            'Long-term ownership across product surfaces, frontend architecture, mentorship, Nuxt 2/3 migration experience, and production UI.'
        },
        {
          label: 'Agents/MCP',
          heading: 'Currently exploring agent-native interfaces and MCP apps.',
          description:
            'MCP apps, AI-to-UI, sandboxed agents, generated interfaces, tool access, and model-native workflows are part of my current research edge.'
        },
        {
          label: 'jasne.ai',
          heading: 'Built a vertical AI product end-to-end.',
          description:
            'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration without a product-engineering handoff.'
        },
        {
          label: 'PostHog',
          heading: 'Use product analytics and MCP as working inputs.',
          description:
            'Implemented PostHog in two organizations, used MCP heavily, and pushed product teams toward observable evidence and faster loops.'
        },
        {
          label: 'MAF',
          heading: 'Worked around retrieval-heavy AI in a real operational context.',
          description:
            'Vector search, large knowledge bases, operational context, and practical AI delivery for a Dubai shopping mall network.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The n8n-shaped loop I would bring.',
      steps: [
        { label: 'Map', description: 'Understand the human workflow, tools, handoffs, data, and where the process fails today.' },
        { label: 'Build', description: 'Prototype the automation or product surface quickly with strong judgment around scope and reliability.' },
        { label: 'Harden', description: 'Add evals, validation, retries, observability, and product affordances so the workflow can survive real use.' },
        { label: 'Adopt', description: 'Measure usage, train the team, improve the workflow, and make the new behavior stick.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'Product and AI workflow directions I would want to test with n8n users.',
      file: 'n8n/workflow-notes.md',
      items: [
        {
          label: 'Agent workflow debugger',
          description:
            'make tool calls, branches, model outputs, retries, and failure reasons inspectable as a product surface, not hidden logs.'
        },
        {
          label: 'AI-assisted node authoring',
          description:
            'help technical users create, test, and harden custom workflow nodes from API docs, examples, and existing company context.'
        },
        {
          label: 'Workflow eval harness',
          description:
            'turn production runs, user corrections, and edge cases into repeatable evals for AI-powered automations.'
        },
        {
          label: 'Builder onboarding loops',
          description:
            'instrument where technical users get stuck and turn those moments into docs, templates, examples, and product affordances.'
        }
      ]
    },
    cv: {
      aiEngineer: {
        title: 'Konrad Straszewski for n8n Sr AI Engineer',
        description:
          'A CV variant for n8n Sr AI Engineer: AI orchestration, agents, Claude/Codex workflows, evals, MCP, product judgment, TypeScript/Vue/Node-adjacent systems.',
        hero: {
          kicker: 'CV variant / n8n Sr AI Engineer',
          headline: 'I turn AI tools, agents, and workflows into production habits.',
          lead:
            'Fit for the AI engineering role: practical AI adoption, agent workflows, MCP apps, product instrumentation, and the judgment to use Claude Code/Codex for reliable systems rather than novelty.'
        },
        proof: {
          kicker: 'AI engineer proof',
          heading: 'Applied AI work close to workflows, tools, evals, and product adoption.',
          rows: [
            {
              label: 'AI adoption',
              heading: 'Lead company-wide AI adoption at Lendi.',
              description:
                'Strategy, tooling, training, KPIs, workflows, internal copilots, and turning AI usage into durable company behavior.'
            },
            {
              label: 'Agents',
              heading: 'Work on MCP apps, sandboxed agents, and AI-to-UI surfaces.',
              description:
                'Current research and building focus: tool access, generated interfaces, agent sandboxes, and model-native workflows.'
            },
            {
              label: 'Claude/Codex',
              heading: 'Use AI coding agents as part of product engineering practice.',
              description:
                'Comfortable with the new builder workflow where judgment, review, evals, and architecture matter more because code generation is cheap.'
            },
            {
              label: 'jasne.ai',
              heading: 'Built a vertical AI product from zero.',
              description:
                'Product strategy, UX, code, infra, AI integration, distribution, and iteration in one loop.'
            },
            {
              label: 'Retrieval',
              heading: 'Collaborated on retrieval-heavy AI for MAF.',
              description:
                'Vector search, large knowledge bases, operational context, and real-world AI delivery.'
            },
            {
              label: 'Stack',
              heading: 'TypeScript/Vue/Nuxt product builder with AI SDK range.',
              description:
                'Vue/Nuxt, TypeScript, Expo, PostgreSQL, Redis, Supabase, PostHog, Vercel AI SDK, Gemini/OpenAI SDKs, LangChain, MCP.'
            }
          ]
        },
        loop: {
          kicker: 'How I work',
          heading: 'The AI workflow loop I would bring to n8n.',
          steps: [
            { label: 'Frame', description: 'Start from the workflow: user intent, tools, data, failure modes, and what should be automated.' },
            { label: 'Prototype', description: 'Use AI-assisted development to get a real path working fast without confusing speed for quality.' },
            { label: 'Evaluate', description: 'Add examples, assertions, traces, user corrections, and fallback behavior so the system can be trusted.' },
            { label: 'Ship', description: 'Turn the prototype into a product surface, instrument usage, and iterate from real runs.' }
          ]
        },
        ideas: {
          kicker: 'n8n ideas',
          heading: 'AI engineering areas I would want to explore.',
          file: 'n8n/ai-engineer-notes.md',
          items: [
            { label: 'Workflow evals', description: 'use production runs and user corrections as a living eval set for AI-powered workflow nodes.' },
            { label: 'Tool-call traces', description: 'make agent decisions, inputs, outputs, retries, and confidence visible to builders.' },
            { label: 'AI node hardening', description: 'help users move from a working prompt to a reliable automation with validation and fallbacks.' },
            { label: 'MCP patterns', description: 'package common MCP server/app patterns for builders who want model-accessible workflows.' }
          ]
        }
      },
      productEngineer: {
        title: 'Konrad Straszewski for n8n Senior Product Engineer',
        description:
          'A CV variant for n8n Senior Product Engineer: TypeScript, Vue/Nuxt, product ownership, workflow automation, AI-native builder practice, and end-to-end shipping.',
        hero: {
          kicker: 'CV variant / n8n Senior Product Engineer',
          headline: 'I build product surfaces for technical users and keep the workflow honest.',
          lead:
            'Fit for the TS/Node/Vue product role: deep Vue/Nuxt history, product ownership, workflow thinking, AI-native tooling, and enough full-stack range to own features end-to-end.'
        },
        proof: {
          kicker: 'Product engineer proof',
          heading: 'Product engineering range across UI, workflows, AI, and adoption.',
          rows: [
            {
              label: 'Vue/Nuxt',
              heading: 'Seven years on Vue/Nuxt product surfaces before moving into AI.',
              description:
                'Frontend development, frontend leadership, Nuxt 2/3 migration experience, mentoring, and production UX ownership.'
            },
            {
              label: 'Lendi',
              heading: 'Helped scale Lendi through long-term product engineering ownership.',
              description:
                "B2B/B2C financial product surfaces, stack decisions, mentoring, R&D, and later AI adoption inside Poland's #1 broker."
            },
            {
              label: 'AI adoption',
              heading: 'Moved teams from tickets toward product-builder workflows.',
              description:
                'Training, tooling, workflows, internal copilots, and operating model changes for engineers using AI responsibly.'
            },
            {
              label: 'jasne.ai',
              heading: 'Built a vertical AI product end-to-end.',
              description:
                'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration.'
            },
            {
              label: 'PostHog',
              heading: 'Use product data and MCP to keep decisions grounded.',
              description:
                'Two implementations, MCP usage, funnels, cohorts, recordings, flags, and product evidence as part of the build loop.'
            },
            {
              label: 'Systems',
              heading: 'Strong around PostgreSQL, Redis, product data, and AI SDKs.',
              description:
                'PostgreSQL, Redis, Supabase, PostHog, SQL/data flows, Vercel AI SDK, Gemini/OpenAI, LangChain, deployment, instrumentation.'
            }
          ]
        },
        loop: {
          kicker: 'How I work',
          heading: 'The product engineering loop I would bring to n8n.',
          steps: [
            { label: 'Understand', description: 'Get close to the technical user and the real automation problem they are trying to solve.' },
            { label: 'Shape', description: 'Turn the workflow into an interface, node behavior, docs, and product constraints that make sense.' },
            { label: 'Ship', description: 'Build across the product surface, instrument the path, and release the smallest useful version.' },
            { label: 'Improve', description: 'Use user behavior, support context, and product analytics to tighten the workflow.' }
          ]
        },
        ideas: {
          kicker: 'n8n ideas',
          heading: 'Product areas I would want to explore.',
          file: 'n8n/product-engineer-notes.md',
          items: [
            { label: 'Node creation UX', description: 'make custom node creation faster without hiding the API and schema details technical users need.' },
            { label: 'Workflow debugging', description: 'turn failed runs into clear timelines with inputs, outputs, retries, and next actions.' },
            { label: 'Templates from usage', description: 'detect repeated workflow shapes and turn them into high-quality templates and docs.' },
            { label: 'AI-assisted docs', description: 'turn support patterns and run failures into docs that teach users while they build.' }
          ]
        }
      }
    },
    contactHeading: 'If n8n wants a builder who can bridge product engineering and AI orchestration, we should talk.'
  },
  plain: {
    company: 'Plain',
    title: 'Konrad Straszewski for Plain Senior Product Engineer (AI)',
    description:
      'A Plain-tailored application page for AI support workflows, customer context, product engineering, AI infrastructure, and end-to-end ownership.',
    role: {
      href: 'https://www.plain.com/careers'
    },
    hero: {
      kicker: 'Application page / Senior Product Engineer (AI)',
      headline: 'I build AI workflows that keep customer context close to the product.',
      lead:
        'Plain is building the support backbone for ambitious B2B teams, where AI changes how companies work with customers across channels. That fits my recent work: practical AI adoption, product surfaces, internal copilots, jasne.ai, and the operating habits that make AI useful.'
    },
    panel: {
      file: 'candidate.plain-fit',
      scoreLabel: 'Role match',
      scoreValue: 'AI product engineer + customer-context builder',
      badge: {
        label: 'Plain-shaped signal',
        value: 'Support loops as product loops',
        description:
          'I like products where customer conversations, product context, AI assistance, and engineering ownership stay in the same loop.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Europe remote' },
        { label: 'Mode', value: 'Customer context -> AI workflow -> product surface -> iteration' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Stack', value: 'TypeScript, Nuxt/Vue, PostgreSQL, Redis, PostHog, AI SDKs, MCP' }
      ]
    },
    relationship: {
      kicker: 'Plain fit',
      heading: 'The role connects support, product, and AI in the way I like to build.',
      copy:
        'Plain is not just ticket handling. The interesting part is turning customer interaction into shared product context: Slack, Discord, email, AI agents, assistants, insights, and the infrastructure that lets teams move faster without losing trust. That is close to my Lendi AI adoption work and to how I build jasne.ai.',
      cards: [
        {
          label: 'Context',
          title: 'I care about the whole customer loop',
          description:
            'The useful product question is not only what the agent answers. It is what context it sees, how the team corrects it, and how those learnings shape the product.'
        },
        {
          label: 'AI',
          title: 'I make AI operational',
          description:
            'At Lendi, my job is to move AI from isolated demos into tooling, workflows, training, KPIs, and production habits across real teams.'
        },
        {
          label: 'Builder',
          title: 'I can own from idea to shipped',
          description:
            'jasne.ai is proof of end-to-end ownership across product strategy, UX, code, infra, model integration, distribution, and iteration.'
        },
        {
          label: 'Evidence',
          title: 'I use product data as a working input',
          description:
            'PostHog, MCP workflows, funnels, cohorts, recordings, and feature flags are part of how I keep product conversations grounded.'
        }
      ]
    },
    fit: {
      kicker: 'Why Plain',
      heading: 'Customer support is becoming a company-wide product surface.',
      cards: [
        {
          index: '01',
          heading: 'AI needs product judgment',
          description:
            'Agents, assistants, and insights only matter when they are useful in the real support workflow: state, confidence, escalation, correction, and next action.'
        },
        {
          index: '02',
          heading: 'Speed needs simplicity',
          description:
            'Plain values small teams, same-day shipping, and stripping complexity down. That matches the operating model I push at Lendi.'
        },
        {
          index: '03',
          heading: 'Customer context should travel',
          description:
            'The support conversation should not die in a silo. It should improve the product, docs, onboarding, internal workflows, and what AI knows next time.'
        },
        {
          index: '04',
          heading: 'Quality is part of trust',
          description:
            'Support tooling has to feel fast, clear, and dependable. My frontend leadership background makes me sensitive to the small details that create that trust.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can build AI product systems around real team workflows.',
      rows: [
        {
          label: 'AI adoption',
          heading: 'Lead practical AI adoption across Lendi.',
          description:
            'Strategy, tooling, training, KPIs, internal copilots, workflow redesign, and the operating model that makes AI usage stick.'
        },
        {
          label: 'Product surfaces',
          heading: 'Owned customer-facing product work in a serious financial domain.',
          description:
            'Eight and a half years across B2B/B2C Lendi surfaces, frontend leadership, R&D, and AI management.'
        },
        {
          label: '0->1 / jasne.ai',
          heading: 'Built a vertical AI product end-to-end.',
          description:
            'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration without a product-engineering handoff.'
        },
        {
          label: 'PostHog',
          heading: 'Use behavior evidence and product analytics as operating context.',
          description:
            'Two PostHog implementations, MCP usage, funnels, cohorts, recordings, flags, and evidence-first product conversations.'
        },
        {
          label: 'AI systems',
          heading: 'Worked around retrieval-heavy AI and model-accessible workflows.',
          description:
            'MAF retrieval collaboration, vector search, large knowledge bases, MCP apps, AI-to-UI exploration, and AI SDK usage.'
        },
        {
          label: 'Data/runtime',
          heading: 'Strong around PostgreSQL, Redis, and product data flows.',
          description:
            'Product data modeling, queryable workflows, caching, queues, runtime state, SQL/data flows, deployment, and instrumentation.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The Plain-shaped loop I would bring.',
      steps: [
        { label: 'Listen', description: 'Start from customer conversations, support friction, team handoffs, and where context disappears.' },
        { label: 'Shape', description: 'Turn the workflow into a clear AI-assisted product surface with explicit state, ownership, and escape hatches.' },
        { label: 'Ship', description: 'Build the smallest useful version, instrument it, document it, and get it in front of real users.' },
        { label: 'Improve', description: 'Use corrections, support patterns, product data, and team feedback to make the system sharper.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'AI product directions I would want to test with Plain users.',
      file: 'plain/ai-product-notes.md',
      items: [
        {
          label: 'Customer context graph',
          description:
            'connect conversations, account state, product events, docs, and internal notes so agents answer from durable context instead of isolated threads.'
        },
        {
          label: 'Agent confidence console',
          description:
            'make sources, assumptions, missing context, escalation reasons, and user corrections visible to support and product teams.'
        },
        {
          label: 'Support-to-product loop',
          description:
            'turn repeated support friction into product ideas, docs updates, onboarding fixes, and measurable follow-up work.'
        },
        {
          label: 'AI workflow evals',
          description:
            'use real customer cases and team corrections as regression tests for assistants, agents, and insight generation.'
        }
      ]
    },
    contactHeading: 'If Plain wants an AI product engineer who keeps customer context close to the build, we should talk.'
  },
  polar: {
    company: 'Polar',
    title: 'Konrad Straszewski for Polar Senior Product Engineer',
    description:
      'A Polar-tailored product engineering pitch for billing, analytics, applied AI startups, high-ownership product systems, and AI-era pricing loops.',
    role: {
      href: 'https://jobs.ashbyhq.com/polar/955c6935-6d03-46e5-b649-a8b958a52962'
    },
    hero: {
      kicker: 'Application page / Senior Product Engineer',
      headline: 'I build product systems for the new economics of software.',
      lead:
        'Polar is building billing and analytics infrastructure for applied AI startups, where pricing, usage, unit economics, and product velocity have to move together. That fits my path: financial product surfaces, AI adoption, product analytics, and 0->1 AI product building.'
    },
    panel: {
      file: 'candidate.polar-fit',
      scoreLabel: 'Role match',
      scoreValue: 'Product systems + AI-era business loops',
      badge: {
        label: 'Polar-shaped signal',
        value: 'Builder with product economics sense',
        description:
          'I have worked where financial trust, product UX, data flows, and practical AI adoption all matter at the same time.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Europe remote' },
        { label: 'Mode', value: 'Usage -> pricing -> product surface -> evidence -> iteration' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Stack', value: 'TypeScript product surfaces, PostgreSQL, Redis, PostHog, AI SDKs' }
      ]
    },
    relationship: {
      kicker: 'Polar fit',
      heading: 'Billing is becoming a product surface for AI-native companies.',
      copy:
        'Polar is aimed at startups that ship fast, price often, and have variable AI costs. The interesting work is not only payments plumbing. It is helping builders understand usage, cost, pricing, compliance, analytics, and customer value as one operating loop.',
      cards: [
        {
          label: 'Finance',
          title: 'I have built in financial product contexts',
          description:
            'Lendi and Finpack taught me that product UX around money needs accuracy, trust, edge-case thinking, and clear flows.'
        },
        {
          label: 'AI',
          title: 'I understand AI as a cost and workflow shift',
          description:
            'My Lendi work is about how AI changes the cost of work, the shape of teams, and what product builders can ship.'
        },
        {
          label: 'Data',
          title: 'Product evidence belongs in the loop',
          description:
            'PostHog, SQL/data flows, PostgreSQL, Redis, and product instrumentation are part of how I turn vague questions into observable systems.'
        },
        {
          label: '0->1',
          title: 'I know the startup builder pressure',
          description:
            'jasne.ai gives me direct reps in product positioning, UX, implementation, AI integration, distribution, and iteration under small-team constraints.'
        }
      ]
    },
    fit: {
      kicker: 'Why Polar',
      heading: 'AI-native companies need billing that understands product reality.',
      cards: [
        {
          index: '01',
          heading: 'Usage is a product signal',
          description:
            'For applied AI startups, usage is not only billing input. It reveals activation, value, cost pressure, pricing fit, and where the product should go next.'
        },
        {
          index: '02',
          heading: 'Pricing should be iterative',
          description:
            'The role matches my current thesis: AI lowers implementation cost, so teams need faster loops around packaging, distribution, and monetization.'
        },
        {
          index: '03',
          heading: 'Small teams need broad owners',
          description:
            'Polar describes a small, engineering-led team with large surface area. That is the environment where product engineering range compounds.'
        },
        {
          index: '04',
          heading: 'Developer products need taste',
          description:
            'Billing primitives, dashboards, docs, and APIs need to feel obvious and trustworthy. That is product craft, not just backend correctness.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can build product systems where data, trust, and AI-era workflows meet.',
      rows: [
        {
          label: 'Lendi',
          heading: 'Helped scale product surfaces in a financial product company.',
          description:
            "Eight and a half years at Lendi, from Vue/Nuxt developer to frontend lead, R&D, and AI Manager while the company became Poland's #1 broker."
        },
        {
          label: 'Finpack',
          heading: 'Started in B2B financial calculators and product UI.',
          description:
            'Early experience around financial calculations, B2B workflows, and the product layer between complex financial logic and users.'
        },
        {
          label: 'AI adoption',
          heading: 'Lead AI adoption as an operating and economic shift.',
          description:
            'Strategy, tooling, training, workflows, KPIs, internal copilots, and redefining engineering from tickets toward outcomes.'
        },
        {
          label: 'jasne.ai',
          heading: 'Built a vertical AI product end-to-end.',
          description:
            'Product strategy, UX, code, infrastructure, AI integration, distribution, and iteration.'
        },
        {
          label: 'PostHog',
          heading: 'Use analytics to connect product decisions to behavior.',
          description:
            'Two implementations, MCP usage, funnels, cohorts, recordings, feature flags, and evidence-first loops.'
        },
        {
          label: 'Systems',
          heading: 'Strong around PostgreSQL, Redis, SQL/data flows, and AI SDKs.',
          description:
            'Product data modeling, queryable workflows, caching, queues, runtime state, Supabase/Neon context, Vercel AI SDK, Gemini/OpenAI, and LangChain.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The Polar-shaped loop I would bring.',
      steps: [
        { label: 'Model', description: 'Understand the usage, pricing, cost, and product behavior that need to become one coherent system.' },
        { label: 'Shape', description: 'Turn business logic into a product surface, API, or workflow that builders can understand and trust.' },
        { label: 'Ship', description: 'Release a useful version, instrument the path, and make edge cases visible early.' },
        { label: 'Iterate', description: 'Use analytics, customer feedback, and product economics to improve pricing, activation, and expansion loops.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'Product directions I would want to test with Polar users.',
      file: 'polar/product-notes.md',
      items: [
        {
          label: 'LLM cost-to-price simulator',
          description:
            'help AI startups model token, workflow, and infrastructure costs against planned pricing before they ship a packaging change.'
        },
        {
          label: 'Unit economics dashboard',
          description:
            'connect customer usage, feature adoption, AI cost, revenue, and margin into one product-facing operating view.'
        },
        {
          label: 'Pricing experiment loop',
          description:
            'make it easy to test packaging changes, observe activation and conversion, and roll forward with clear evidence.'
        },
        {
          label: 'Billing primitive onboarding',
          description:
            'instrument where developers get stuck across docs, API setup, test data, and first invoice so activation work is measurable.'
        }
      ]
    },
    contactHeading: 'If Polar needs a product engineer for AI-era billing and analytics loops, we should talk.'
  },
  lago: {
    company: 'Lago',
    title: 'Konrad Straszewski for Lago Product Engineer (Growth)',
    description:
      'A Lago-tailored application page for AI agents for growth, multi-agent workflows, production-grade AI systems, open-source billing context, and product engineering ownership.',
    role: {
      href: 'https://jobs.ashbyhq.com/lago/638af98e-061c-4f8b-adf0-ec23311ea2a4'
    },
    hero: {
      kicker: 'Application page / Product Engineer (Growth)',
      headline: 'I turn AI agent prototypes into workflows people can actually run.',
      lead:
        'Lago wants to turn working Claude Code-powered GTM agents into a production-grade multi-agent platform. That maps closely to my current work: AI adoption, internal copilots, workflow redesign, product instrumentation, and building AI products end-to-end.'
    },
    panel: {
      file: 'candidate.lago-fit',
      scoreLabel: 'Role match',
      scoreValue: 'AI workflow builder + product-minded operator',
      badge: {
        label: 'Lago-shaped signal',
        value: 'Prototype -> platform',
        description:
          'I am strongest when the work moves from messy first version to repeatable workflow, measured adoption, and better operating habits.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Remote Europe fit' },
        { label: 'Mode', value: 'Prototype -> decompose -> instrument -> adopt -> improve' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Stack', value: 'AI agents, TypeScript, PostgreSQL, Redis, PostHog, MCP, AI SDKs' }
      ]
    },
    relationship: {
      kicker: 'Lago fit',
      heading: 'The role is growth engineering, but the real problem is AI operating infrastructure.',
      copy:
        'Lago already has working AI-powered internal agents for lead qualification, research, outreach, monitoring, and GTM workflows. The role is to turn that into a reliable multi-agent platform with instrumentation, feedback loops, and team adoption. That is the same kind of practical AI work I have been leading at Lendi.',
      cards: [
        {
          label: 'AI ops',
          title: 'I make AI useful inside companies',
          description:
            'My day job is not AI theater. It is tooling, training, workflows, internal copilots, KPIs, and the operating changes that make adoption real.'
        },
        {
          label: 'Agents',
          title: 'I think in tools, state, and feedback loops',
          description:
            'Useful agents need decomposition, context, tool access, evals, human review, telemetry, and product surfaces operators can trust.'
        },
        {
          label: 'Growth',
          title: 'Distribution is part of the product',
          description:
            'jasne.ai is built around product truth, positioning, distribution loops, and turning product work into market-facing execution.'
        },
        {
          label: 'Infra',
          title: 'I respect systems that others depend on',
          description:
            'Lago builds infrastructure, so the internal AI platform has to be observable, maintainable, and good enough for more than one power user.'
        }
      ]
    },
    fit: {
      kicker: 'Why Lago',
      heading: 'Internal AI becomes valuable when it becomes shared infrastructure.',
      cards: [
        {
          index: '01',
          heading: 'Agents need decomposition',
          description:
            'Moving from monolithic skills to independent agents is a product and systems problem: boundaries, handoffs, context, ownership, and failure modes.'
        },
        {
          index: '02',
          heading: 'Feedback should improve the system',
          description:
            'The self-improvement loop in the role is exactly where AI work gets serious: corrections, baselines, evals, human approval, and visible quality.'
        },
        {
          index: '03',
          heading: 'GTM workflows are real product work',
          description:
            'Lead research, outreach, monitoring, and qualification are messy workflows with users, data, UX, and reliability concerns.'
        },
        {
          index: '04',
          heading: 'Open-source billing context matters',
          description:
            'Lago serves developer, fintech, infrastructure, and AI/ML companies. My financial product background and product-builder range make that context accessible.'
        }
      ]
    },
    proof: {
      kicker: 'Proof points',
      heading: 'Evidence that I can turn AI workflows into production habits and measurable loops.',
      rows: [
        {
          label: 'AI adoption',
          heading: 'Lead company-wide AI adoption at Lendi.',
          description:
            'Strategy, tooling, training, workflows, KPIs, internal copilots, and the product-builder operating model for real teams.'
        },
        {
          label: 'Workflow design',
          heading: 'Redesign how engineering and product teams work with AI.',
          description:
            'The work is not only tools. It is changing rituals, ownership, measurement, and the way teams move from tickets to outcomes.'
        },
        {
          label: 'jasne.ai',
          heading: 'Built a vertical AI product around distribution loops.',
          description:
            'Product strategy, UX, code, infra, AI integration, positioning, distribution, and iteration owned end-to-end.'
        },
        {
          label: 'PostHog',
          heading: 'Instrument product loops and use evidence as a working input.',
          description:
            'Two implementations, MCP usage, funnels, cohorts, recordings, flags, and product evidence in day-to-day decisions.'
        },
        {
          label: 'Retrieval',
          heading: 'Collaborated on retrieval-heavy AI for operational context.',
          description:
            'Vector search, large knowledge bases, and practical AI surfaces for a Dubai mall network.'
        },
        {
          label: 'Systems',
          heading: 'Strong around PostgreSQL, Redis, AI SDKs, and product data flows.',
          description:
            'Product data modeling, caching, queues, runtime state, Supabase/Neon context, Vercel AI SDK, Gemini/OpenAI, LangChain, MCP, and instrumentation.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The Lago-shaped loop I would bring.',
      steps: [
        { label: 'Map', description: 'Understand the current agent workflow, users, data sources, tool calls, handoffs, and failure patterns.' },
        { label: 'Decompose', description: 'Split monolithic skills into clear agents with boundaries, contracts, telemetry, and human review points.' },
        { label: 'Baseline', description: 'Instrument accuracy, latency, adoption, and operator feedback so quality can be compared over time.' },
        { label: 'Adopt', description: 'Turn the platform into a team habit through docs, UI, training, and loops that make new agents easier to launch.' }
      ]
    },
    ideas: {
      kicker: 'What I would explore',
      heading: 'AI agent platform directions I would want to test at Lago.',
      file: 'lago/agent-notes.md',
      items: [
        {
          label: 'Agent decomposition map',
          description:
            'visualize each GTM agent, its tools, data inputs, outputs, confidence, dependencies, and human approval points.'
        },
        {
          label: 'Feedback-to-eval loop',
          description:
            'turn accepted edits, rejected drafts, missed signals, and operator comments into repeatable benchmarks for agent calibration.'
        },
        {
          label: 'GTM context layer',
          description:
            'standardize account, usage, CRM, Slack, email, and product context so agents stop reinventing context per workflow.'
        },
        {
          label: 'Agent launch kit',
          description:
            'make new internal agents faster to create with templates, logging, eval harnesses, permissions, and review workflows built in.'
        }
      ]
    },
    contactHeading: 'If Lago wants to turn working AI agent prototypes into shared operating infrastructure, we should talk.'
  }
} as const
