export const profile = {
  person: {
    name: 'Konrad Straszewski',
    initials: 'KS',
    role: 'AI Manager & Builder',
    currentRole: 'AI Manager · Lendi',
    location: 'Szczecin, Poland',
    availability: 'Available · senior AI roles · remote',
    openTo: 'Building products',
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
      { label: 'Lendi', href: '#lendi' },
      { label: 'jasne.ai', href: '/jasne.ai' },
      { label: 'MCP', href: '/mcp' },
      { label: 'Linear', href: '/linear' },
      { label: 'Medusa', href: '/medusa' },
      { label: 'Principles', href: '#principles' },
      { label: 'Tech', href: '#technologies' },
      { label: 'Track record', href: '#track' },
      { label: 'Interests', href: '#interests' },
      { label: 'About', href: '#about' },
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
      { label: 'Stack', value: 'vendor-agnostic' }
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
    shotFooter: ['VERTICAL AI · 0→1 PRODUCT', '2024 → NOW'],
    facts: [
      { label: 'Role', value: 'Founder + Product lead' },
      { label: 'Stack', value: 'Expo, Nuxt, Vercel AI SDK' },
      { label: 'Models', value: 'Gemini' },
      { label: 'DB', value: 'Supabase' },
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
          "I still prefer vendor-agnostic systems, but lock-in is no longer a year of work for an eight-person team. If Supabase stops fitting, migration is a product decision, not a company trauma."
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
      'A focused product-engineering CV: product ownership, AI-native building, PostHog practice, jasne.ai, and the stack I use to ship.',
    summary:
      'Product Engineer and AI-native builder with 11 years across product engineering, frontend leadership, and AI adoption. I spent 8.5 years inside Lendi, moving from Vue/Nuxt developer to frontend lead, R&D, and now AI Manager. My work is practical: own the product surface, build the tool, ship the workflow, instrument the loop, write the context, and keep iterating with users and teams.',
    highlights: [
      "Helped scale Lendi from a startup into Poland's #1 broker and the fastest-growing broker in Europe.",
      'Progressed from frontend developer to lead, R&D, and AI Manager while staying close to product surfaces, UX, tooling, and shipping.',
      'Lead practical AI adoption at Lendi: strategy, tooling, training, KPIs, production workflows, and the product-builder operating model.',
      'Implemented PostHog in two organizations, used PostHog MCP heavily, and advocated for evidence-first product loops.',
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
        description: 'PDF w stylu podstrony PostHog',
        href: '/api/cv/posthog-pe.pdf'
      },
      {
        label: 'PostHog Product Manager',
        description: 'PDF pod rolę PM ex-founder / ex-product engineer',
        href: '/api/cv/posthog-pm.pdf'
      },
      {
        label: 'PostHog AI Research Engineer',
        description: 'PDF pod applied AI, product data i research loops',
        href: '/api/cv/posthog-ai-research.pdf'
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
            'Vue/Nuxt, Expo, Supabase, SQL/data flows, Vercel AI SDK, Gemini/OpenAI, LangChain, PostHog, deployment, instrumentation, and product UX.'
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
          heading: 'Comfortable with product data flows, SQL-backed systems, analytics, and instrumentation.',
          description:
            'Supabase, PostHog, SQL/data flows, product instrumentation, cohorts/funnels, and the habit of turning ambiguous questions into queryable ones.'
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
            'Product strategy, UX, code, infrastructure, Gemini, Vercel AI SDK, Supabase, distribution, and iteration.'
        },
        {
          label: 'Agents',
          heading: 'Focused on MCP apps, sandboxed agents, and AI-native interfaces.',
          description:
            'The same product direction PostHog AI is moving toward: tool access, skills, traces, context, and model-native workflows.'
        },
        {
          label: 'Data / stack',
          heading: 'Comfortable around SQL/data flows, instrumentation, and AI SDKs.',
          description:
            'TypeScript, Vue/Nuxt, Expo, Supabase, SQL/data flows, PostHog, LangChain, Gemini/OpenAI SDKs, and product UX.'
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
        { label: 'Stack', value: 'TypeScript product surfaces, Nuxt/Vue, AI SDKs, SQL/data flows' }
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
          label: 'PostHog',
          heading: 'Used product evidence as a working input, not a reporting layer.',
          description:
            'Implemented PostHog in two organizations, used MCP heavily, and pushed teams toward funnels, cohorts, recordings, flags, and observable product truth.'
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
      'A Medusa-tailored product engineering pitch from Konrad Straszewski: open-source product systems, TypeScript product work, AI-native developer workflows, and end-to-end ownership.',
    role: {
      href: 'https://medusajs.com/careers/product-engineer/'
    },
    hero: {
      kicker: 'Application page / Product Engineer',
      headline: 'I build developer products where code and product strategy stay together.',
      lead:
        'Medusa needs a product engineer who can own systems end-to-end, understand users and business context, and help make AI-era commerce faster to build. That fits my builder path: product surfaces, AI adoption, jasne.ai, and a bias toward shipping useful systems.'
    },
    panel: {
      file: 'candidate.medusa-fit',
      scoreLabel: 'Role match',
      scoreValue: 'Open-source product engineer + AI builder',
      badge: {
        label: 'Medusa-shaped signal',
        value: 'Developer product ownership',
        description: 'Full-stack product thinking, AI workflow experience, and a practical feel for tools that developers actually want to use.'
      },
      facts: [
        { label: 'Location', value: 'Szczecin, Poland - Europe timezone' },
        { label: 'Mode', value: 'Understand users -> build systems -> ship fast' },
        { label: 'Current', value: 'AI Manager at Lendi; founder of jasne.ai' },
        { label: 'Stack', value: 'TypeScript, Nuxt/Vue, Supabase, AI SDKs, PostHog, SQL/data flows' }
      ]
    },
    relationship: {
      kicker: 'Medusa in practice',
      heading: 'The role is about builder leverage, not just commerce.',
      copy:
        'Medusa is an open-source platform for modern commerce applications, managed infrastructure, and AI-assisted building. The fit for me is the product-engineering loop: understand the developer, make the abstractions useful, ship the system, and keep the product close to real customer pressure.',
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
      heading: 'Commerce is being rebuilt as programmable infrastructure.',
      cards: [
        {
          index: '01',
          heading: 'Abstractions matter',
          description:
            'The interesting work is not another admin panel. It is creating primitives, APIs, workflows, and UI that make custom commerce cheaper to build.'
        },
        {
          index: '02',
          heading: 'AI changes implementation cost',
          description:
            'Medusa is explicit about AI making custom software cheaper. That is the same thesis behind my AI adoption work at Lendi.'
        },
        {
          index: '03',
          heading: 'Developers still need tasteful product',
          description:
            'Developer tools win when the product feels fast, obvious, flexible, and trustworthy. That requires engineering judgment and product taste together.'
        },
        {
          index: '04',
          heading: 'Small teams need owners',
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
          heading: 'Helped scale product surfaces inside a fast-growing financial company.',
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
          heading: 'Lead the shift from AI demos to working product and team workflows.',
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
          heading: 'Worked around retrieval-heavy AI and modern AI product surfaces.',
          description:
            'MAF retrieval collaboration, Gemini/OpenAI SDKs, Vercel AI SDK, Supabase, LangChain, MCP apps, and AI-to-UI exploration.'
        }
      ]
    },
    loop: {
      kicker: 'How I work',
      heading: 'The Medusa-shaped loop I would bring.',
      steps: [
        { label: 'Understand', description: 'Start from the developer or operator workflow: what they are trying to build, where time disappears, and what abstraction would help.' },
        { label: 'Design', description: 'Turn the workflow into primitives, APIs, UI, and docs that make the next action obvious.' },
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
            'turn product catalog, fulfillment, payment, and custom workflow setup into guided agent-assisted flows with explicit review points.'
        },
        {
          label: 'Composable admin surfaces',
          description:
            'let teams shape admin workflows around their commerce model instead of forcing every implementation into the same rigid interface.'
        },
        {
          label: 'Developer onboarding telemetry',
          description:
            'instrument where developers get stuck across docs, templates, APIs, and deployment so activation work is grounded in evidence.'
        },
        {
          label: 'Operational workflow debugger',
          description:
            'make orders, inventory, payments, and fulfillment flows inspectable as timelines with clear state, failure reasons, and suggested fixes.'
        }
      ]
    },
    contactHeading: 'If Medusa needs a product engineer who can build the platform and the workflow around it, we should talk.'
  }
} as const
