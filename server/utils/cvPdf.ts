type Profile = typeof import('../../app/data/profile').profile
type CvVariant =
  | 'general'
  | 'posthog-pe'
  | 'posthog-pm'
  | 'posthog-ai-research'
  | 'linear-fullstack-engineer'
  | 'medusa-product-engineer'
  | 'n8n-ai-engineer'
  | 'n8n-product-engineer'
type TargetedCvContent =
  | Profile['posthog']
  | Profile['posthogPm']
  | Profile['posthogAiResearch']
  | Profile['linear']
  | Profile['medusa']
  | Profile['n8n']['cv']['aiEngineer']
  | Profile['n8n']['cv']['productEngineer']
type Color = [number, number, number]
type CvThemeName = 'posthog' | 'linear' | 'medusa' | 'n8n'

const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 48
}

const colors = {
  bg: [0.98, 0.98, 0.97] as Color,
  warm: [0.95, 0.95, 0.92] as Color,
  ink: [0.067, 0.067, 0.067] as Color,
  dim: [0.54, 0.54, 0.52] as Color,
  rule: [0.9, 0.9, 0.87] as Color,
  accent: [0.77, 0.35, 0.16] as Color,
  dark: [0.055, 0.055, 0.047] as Color,
  paper: [1, 0.97, 0.91] as Color,
  phBg: [0.969, 0.941, 0.875] as Color,
  phOrange: [0.878, 0.373, 0.184] as Color,
  phYellow: [0.957, 0.784, 0.294] as Color,
  phGreen: [0.302, 0.553, 0.353] as Color,
  linearBg: [0.031, 0.035, 0.039] as Color,
  linearPanel: [0.078, 0.082, 0.102] as Color,
  linearLine: [0.18, 0.19, 0.22] as Color,
  linearText: [0.957, 0.961, 0.973] as Color,
  linearMuted: [0.706, 0.737, 0.816] as Color,
  linearAccent: [0.369, 0.416, 0.824] as Color,
  medusaBg: [0.972, 0.972, 0.948] as Color,
  medusaPanel: [1, 1, 1] as Color,
  medusaLine: [0.851, 0.851, 0.824] as Color,
  medusaText: [0.067, 0.067, 0.067] as Color,
  medusaMuted: [0.4, 0.404, 0.38] as Color,
  medusaGreen: [0.129, 0.647, 0.404] as Color,
  medusaLime: [0.914, 0.973, 0.38] as Color,
  n8nBg: [1, 0.969, 0.98] as Color,
  n8nPanel: [1, 1, 1] as Color,
  n8nLine: [0.937, 0.722, 0.78] as Color,
  n8nText: [0.016, 0.02, 0.024] as Color,
  n8nMuted: [0.447, 0.361, 0.396] as Color,
  n8nPink: [0.918, 0.294, 0.443] as Color
}

const cvThemeName = (variant: CvVariant): CvThemeName =>
  variant.includes('linear')
    ? 'linear'
    : variant.includes('medusa')
      ? 'medusa'
      : variant.includes('n8n')
        ? 'n8n'
        : 'posthog'

const cvThemes: Record<
  CvThemeName,
  {
    bg: Color
    panel: Color
    line: Color
    text: Color
    muted: Color
    accent: Color
    accentSoft: Color
    grid: boolean
    shadow: boolean
    dark: boolean
  }
> = {
  posthog: {
    bg: colors.phBg,
    panel: colors.paper,
    line: colors.ink,
    text: colors.ink,
    muted: colors.dim,
    accent: colors.phOrange,
    accentSoft: [0.94, 0.89, 0.78],
    grid: true,
    shadow: true,
    dark: false
  },
  linear: {
    bg: colors.linearBg,
    panel: colors.linearPanel,
    line: colors.linearLine,
    text: colors.linearText,
    muted: colors.linearMuted,
    accent: colors.linearAccent,
    accentSoft: [0.102, 0.11, 0.15],
    grid: false,
    shadow: false,
    dark: true
  },
  medusa: {
    bg: colors.medusaBg,
    panel: colors.medusaPanel,
    line: colors.medusaLine,
    text: colors.medusaText,
    muted: colors.medusaMuted,
    accent: colors.medusaText,
    accentSoft: colors.medusaLime,
    grid: false,
    shadow: false,
    dark: false
  },
  n8n: {
    bg: colors.n8nBg,
    panel: colors.n8nPanel,
    line: colors.n8nLine,
    text: colors.n8nText,
    muted: colors.n8nMuted,
    accent: colors.n8nPink,
    accentSoft: [1, 0.895, 0.925],
    grid: true,
    shadow: false,
    dark: false
  }
}

const sanitize = (input: string | number) =>
  String(input)
    .replace(/→/g, '->')
    .replace(/—|–/g, '-')
    .replace(/·/g, '-')
    .replace(/✦/g, '*')
    .replace(/©/g, '(c)')
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')

const escapePdfText = (input: string | number) =>
  sanitize(input).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

const num = (value: number) => Number(value.toFixed(3)).toString()
const rgb = (color: Color, op: 'rg' | 'RG') => `${num(color[0])} ${num(color[1])} ${num(color[2])} ${op}`

const approxTextWidth = (text: string, size: number, font = 'F1') => {
  const factor = font === 'F2' || font === 'F4' ? 0.56 : 0.51
  return sanitize(text).length * size * factor
}

const wrapText = (text: string, maxWidth: number, size: number, font = 'F1') => {
  const words = sanitize(text).split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word

    if (approxTextWidth(next, size, font) <= maxWidth) {
      current = next
      continue
    }

    if (current) {
      lines.push(current)
    }

    if (approxTextWidth(word, size, font) <= maxWidth) {
      current = word
      continue
    }

    const chunkSize = Math.max(6, Math.floor(maxWidth / (size * 0.56)))
    for (let index = 0; index < word.length; index += chunkSize) {
      const chunk = word.slice(index, index + chunkSize)
      if (index + chunkSize >= word.length) {
        current = chunk
      } else {
        lines.push(chunk)
      }
    }
  }

  if (current) {
    lines.push(current)
  }

  return lines
}

class PdfDoc {
  private pages: string[] = []
  private ops: string[] = []

  y = 60

  constructor(private readonly variant: CvVariant) {
    this.addPage()
  }

  get theme() {
    return cvThemes[cvThemeName(this.variant)]
  }

  addPage() {
    if (this.ops.length) {
      this.pages.push(this.ops.join('\n'))
    }

    this.ops = []
    this.y = 60
    this.fillRect(0, 0, PAGE.width, PAGE.height, this.variant === 'general' ? colors.bg : this.theme.bg)

    if (this.variant !== 'general' && this.theme.grid) {
      for (let x = 0; x <= PAGE.width; x += 36) {
        this.line(x, 0, x, PAGE.height, this.theme === cvThemes.n8n ? [0.975, 0.82, 0.86] : [0.89, 0.86, 0.78], 0.35)
      }

      for (let y = 0; y <= PAGE.height; y += 36) {
        this.line(0, y, PAGE.width, y, this.theme === cvThemes.n8n ? [0.975, 0.82, 0.86] : [0.89, 0.86, 0.78], 0.35)
      }
    }
  }

  finish() {
    if (this.ops.length) {
      this.pages.push(this.ops.join('\n'))
      this.ops = []
    }

    return buildPdf(this.pages)
  }

  ensure(height: number) {
    if (this.y + height > PAGE.height - 50) {
      this.addPage()
      this.y = 70
    }
  }

  text(text: string | number, x: number, y: number, size: number, font = 'F1', color: Color = colors.ink) {
    this.ops.push(
      `BT ${rgb(color, 'rg')} /${font} ${num(size)} Tf ${num(x)} ${num(PAGE.height - y)} Td (${escapePdfText(
        text
      )}) Tj ET`
    )
  }

  textBlock(
    text: string,
    x: number,
    y: number,
    width: number,
    size: number,
    lineHeight: number,
    options: { font?: string; color?: Color } = {}
  ) {
    const lines = wrapText(text, width, size, options.font)
    lines.forEach((line, index) => {
      this.text(line, x, y + index * lineHeight, size, options.font ?? 'F1', options.color ?? colors.ink)
    })

    return y + lines.length * lineHeight
  }

  fillRect(x: number, y: number, width: number, height: number, color: Color) {
    this.ops.push(`${rgb(color, 'rg')} ${num(x)} ${num(PAGE.height - y - height)} ${num(width)} ${num(height)} re f`)
  }

  strokeRect(x: number, y: number, width: number, height: number, color: Color = colors.ink, widthPx = 1) {
    this.ops.push(
      `${num(widthPx)} w ${rgb(color, 'RG')} ${num(x)} ${num(PAGE.height - y - height)} ${num(width)} ${num(
        height
      )} re S`
    )
  }

  line(x1: number, y1: number, x2: number, y2: number, color: Color = colors.rule, width = 1) {
    this.ops.push(
      `${num(width)} w ${rgb(color, 'RG')} ${num(x1)} ${num(PAGE.height - y1)} m ${num(x2)} ${num(
        PAGE.height - y2
      )} l S`
    )
  }

  panel(x: number, y: number, width: number, height: number, fill: Color, stroke: Color = colors.ink, shadow = false) {
    if (shadow) {
      this.fillRect(x + 5, y + 5, width, height, colors.ink)
    }

    this.fillRect(x, y, width, height, fill)
    this.strokeRect(x, y, width, height, stroke, 1.5)
  }
}

const buildPdf = (pages: string[]) => {
  const objects: string[] = []
  const startObject = 7
  const kids = pages.map((_, index) => `${startObject + index * 2 + 1} 0 R`).join(' ')

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [ ${kids} ] /Count ${pages.length} >>`
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'
  objects[5] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>'
  objects[6] = '<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>'

  pages.forEach((content, index) => {
    const contentObject = startObject + index * 2
    const pageObject = contentObject + 1
    const length = Buffer.byteLength(content, 'binary')

    objects[contentObject] = `<< /Length ${length} >>\nstream\n${content}\nendstream`
    objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R /F4 6 0 R >> >> /Contents ${contentObject} 0 R >>`
  })

  let pdf = '%PDF-1.4\n%\x7F\x7F\x7F\x7F\n'
  const offsets = [0]

  for (let objectNumber = 1; objectNumber < objects.length; objectNumber += 1) {
    offsets[objectNumber] = Buffer.byteLength(pdf, 'binary')
    pdf += `${objectNumber} 0 obj\n${objects[objectNumber]}\nendobj\n`
  }

  const xrefOffset = Buffer.byteLength(pdf, 'binary')
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`

  for (let objectNumber = 1; objectNumber < objects.length; objectNumber += 1) {
    pdf += `${String(offsets[objectNumber]).padStart(10, '0')} 00000 n \n`
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, 'binary')
}

const drawGeneralHeader = (doc: PdfDoc, profile: Profile) => {
  doc.text('CV', PAGE.margin, 54, 9, 'F2', colors.accent)
  doc.text(profile.person.name, PAGE.margin, 90, 30, 'F4')
  doc.text('Product Engineer / AI-native Builder', PAGE.margin, 112, 12, 'F1', colors.dim)
  doc.text(profile.person.email, 356, 66, 9, 'F1', colors.dim)
  doc.text(profile.person.phone, 356, 82, 9, 'F1', colors.dim)
  doc.text(profile.links.linkedin.value, 356, 98, 9, 'F1', colors.dim)
  doc.line(PAGE.margin, 134, PAGE.width - PAGE.margin, 134, colors.rule)
  doc.y = 170
}

const sectionTitle = (doc: PdfDoc, label: string) => {
  doc.ensure(48)
  doc.text(label.toUpperCase(), PAGE.margin, doc.y, 8, 'F2', colors.accent)
  doc.line(150, doc.y - 3, PAGE.width - PAGE.margin, doc.y - 3, colors.rule)
  doc.y += 30
}

const drawGeneralCv = (profile: Profile) => {
  const doc = new PdfDoc('general')
  drawGeneralHeader(doc, profile)

  sectionTitle(doc, 'Profile')
  doc.y = doc.textBlock(profile.cv.summary, PAGE.margin, doc.y, 500, 11, 15, { color: colors.ink })
  doc.y += 18

  profile.cv.highlights.forEach((highlight) => {
    doc.ensure(30)
    doc.text('-', PAGE.margin, doc.y, 10, 'F2', colors.accent)
    doc.y = doc.textBlock(highlight, 66, doc.y, 472, 10, 14, { color: colors.ink })
    doc.y += 6
  })

  doc.y += 16
  sectionTitle(doc, 'Experience')

  profile.track.experience.forEach((item) => {
    doc.ensure(82)
    const startY = doc.y
    doc.text(item.year, PAGE.margin, startY, 8, 'F2', colors.dim)
    doc.text(item.role, 142, startY, 14, 'F4')
    doc.text(item.org, 142, startY + 17, 9, 'F1', colors.dim)
    const descY = doc.textBlock(item.description, 304, startY, 234, 9, 12.5, { color: colors.ink })
    doc.y = Math.max(startY + 44, descY) + 18
    doc.line(PAGE.margin, doc.y - 8, PAGE.width - PAGE.margin, doc.y - 8, colors.rule)
  })

  doc.y += 16
  sectionTitle(doc, 'Selected work')
  doc.text('Lendi', PAGE.margin, doc.y, 14, 'F4')
  doc.y = doc.textBlock(profile.lendi.pride, 142, doc.y, 396, 10, 14, { color: colors.ink })
  doc.y += 18
  doc.text(profile.jasne.name, PAGE.margin, doc.y, 14, 'F4')
  doc.y = doc.textBlock(profile.jasne.intro, 142, doc.y, 396, 10, 14, { color: colors.ink })

  doc.y += 28
  sectionTitle(doc, 'Technologies')
  doc.ensure(50)
  doc.text('Core stack', PAGE.margin, doc.y, 10, 'F2', colors.dim)
  doc.y = doc.textBlock(profile.stack.technologies.join(' / '), 142, doc.y, 396, 10, 14, { color: colors.ink })

  doc.y += 22
  sectionTitle(doc, 'Personal')
  doc.y = doc.textBlock(profile.about.copy, PAGE.margin, doc.y, 500, 10, 14, { color: colors.ink })
  doc.y += 10
  doc.y = doc.textBlock(
    profile.about.items.map((item) => `${item.label}: ${item.value}`).join(' '),
    PAGE.margin,
    doc.y,
    500,
    9,
    12.5,
    { color: colors.dim }
  )

  doc.y += 18
  sectionTitle(doc, 'Education')
  doc.text(profile.track.education.field, PAGE.margin, doc.y, 11, 'F2')
  doc.text(profile.track.education.school, 220, doc.y, 10, 'F1', colors.dim)

  return doc.finish()
}

const compactTextBlock = (
  doc: PdfDoc,
  text: string,
  x: number,
  y: number,
  width: number,
  size: number,
  lineHeight: number,
  maxLines: number,
  options: { font?: string; color?: Color } = {}
) => {
  const lines = wrapText(text, width, size, options.font)
  const visibleLines = lines.slice(0, maxLines)

  visibleLines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight, size, options.font ?? 'F1', options.color ?? colors.ink)
  })

  return y + visibleLines.length * lineHeight
}

const targetHeader = (doc: PdfDoc, profile: Profile, subtitle = 'Product Engineer') => {
  const theme = doc.theme
  doc.panel(PAGE.margin, 42, 32, 32, theme.accent, theme.line, theme.shadow)
  doc.text(profile.person.initials, 57, 64, 11, 'F2', theme.dark ? colors.linearText : colors.paper)
  doc.text(profile.person.name, 94, 60, 16, 'F2', theme.text)
  doc.text(subtitle, 94, 77, 8, 'F1', theme.muted)

  if (theme === cvThemes.linear) {
    doc.line(94, 86, 520, 86, theme.line, 0.8)
  }
}

const targetCard = (doc: PdfDoc, x: number, y: number, width: number, height: number) => {
  doc.panel(x, y, width, height, doc.theme.panel, doc.theme.line, doc.theme.shadow)
}

const drawTargetedCv = (profile: Profile, variant: Exclude<CvVariant, 'general'>) => {
  const doc = new PdfDoc(variant)
  const theme = doc.theme
  const content: TargetedCvContent =
    variant === 'linear-fullstack-engineer'
      ? profile.linear
      : variant === 'medusa-product-engineer'
        ? profile.medusa
        : variant === 'n8n-ai-engineer'
      ? profile.n8n.cv.aiEngineer
      : variant === 'n8n-product-engineer'
        ? profile.n8n.cv.productEngineer
        : variant === 'posthog-ai-research'
      ? profile.posthogAiResearch
      : variant === 'posthog-pm'
        ? profile.posthogPm
        : profile.posthog
  const roleLabel =
    variant === 'linear-fullstack-engineer'
      ? 'Linear Senior Fullstack Engineer'
      : variant === 'medusa-product-engineer'
        ? 'Medusa Product Engineer'
        : variant === 'n8n-ai-engineer'
      ? 'n8n Sr AI Engineer'
      : variant === 'n8n-product-engineer'
        ? 'n8n Senior Product Engineer'
        : variant === 'posthog-ai-research'
      ? 'AI Research Engineer'
      : variant === 'posthog-pm'
        ? 'Product Manager'
        : 'Product Engineer'

  targetHeader(doc, profile, roleLabel)

  const heroY = 96
  targetCard(doc, PAGE.margin, heroY, 499, 124)
  doc.fillRect(PAGE.margin, heroY, 499, 25, theme.accentSoft)
  doc.line(PAGE.margin, heroY + 25, PAGE.width - PAGE.margin, heroY + 25, theme.line, 1.1)
  doc.text(content.hero.kicker, 64, heroY + 17, 7.5, 'F2', theme.dark ? theme.text : theme.text)
  compactTextBlock(doc, content.hero.headline, 64, heroY + 55, 285, 18, 20, 3, {
    font: 'F4',
    color: theme.text
  })
  doc.text('WHY', 376, heroY + 54, 7, 'F2', theme.accent)
  compactTextBlock(doc, content.hero.lead, 376, heroY + 72, 135, 8, 10.5, 5, { color: theme.muted })

  doc.text(content.proof.kicker.toUpperCase(), PAGE.margin, 252, 8, 'F2', theme.accent)
  compactTextBlock(doc, content.proof.heading, PAGE.margin, 274, 366, 15.5, 17.5, 2, {
    font: 'F4',
    color: theme.text
  })

  const proofCardWidth = 242
  content.proof.rows.forEach((row, index) => {
    const column = index % 2
    const rowIndex = Math.floor(index / 2)
    const x = PAGE.margin + column * (proofCardWidth + 15)
    const y = 326 + rowIndex * 80

    targetCard(doc, x, y, proofCardWidth, 66)
    if (theme === cvThemes.n8n) {
      doc.fillRect(x - 3, y + 18, 6, 6, theme.accent)
      doc.line(x - 18, y + 21, x - 3, y + 21, theme.accent, 0.7)
    }
    doc.text(row.label.toUpperCase(), x + 12, y + 17, 7, 'F2', theme.accent)
    compactTextBlock(doc, row.heading, x + 12, y + 33, proofCardWidth - 24, 8.4, 10, 3, {
      font: 'F2',
      color: theme.text
    })
  })

  doc.text(content.loop.kicker.toUpperCase(), PAGE.margin, 592, 8, 'F2', theme.accent)
  compactTextBlock(doc, content.loop.heading, PAGE.margin, 615, 190, 16, 18, 2, {
    font: 'F4',
    color: theme.text
  })
  content.loop.steps.forEach((step, index) => {
    const y = 584 + index * 48
    doc.panel(258, y, 289, 42, theme.panel, theme.line)
    doc.text(step.label, 272, y + 16, 9.2, 'F2', theme.text)
    compactTextBlock(doc, step.description, 350, y + 14, 178, 7.3, 9, 3, { color: theme.muted })
  })

  doc.addPage()
  targetHeader(doc, profile, roleLabel)

  doc.text('TRACK RECORD', PAGE.margin, 104, 8, 'F2', theme.accent)
  compactTextBlock(doc, profile.track.heading, PAGE.margin, 126, 430, 15, 17, 2, {
    font: 'F4',
    color: theme.text
  })

  profile.track.experience.slice(0, 5).forEach((item, index) => {
    const y = 190 + index * 94
    doc.text(item.year, PAGE.margin, y, 7.2, 'F2', theme.muted)
    doc.text(`${item.role} / ${item.org}`, 142, y, 9, 'F2', theme.text)
    compactTextBlock(doc, item.description, 142, y + 14, 375, 7.4, 9.2, 6, { color: theme.muted })
    doc.line(PAGE.margin, y + 74, PAGE.width - PAGE.margin, y + 74, theme.line, 0.65)
  })

  doc.panel(PAGE.margin, 674, 499, 44, theme.panel, theme.line)
  doc.text('OUTSIDE WORK', 64, 694, 8, 'F2', theme.accent)
  compactTextBlock(
    doc,
    'Boxing training / automotive / technology / science - grounded interests where feedback, systems, and craft matter.',
    174,
    693,
    342,
    8.2,
    10.2,
    2,
    { color: theme.text }
  )

  doc.panel(PAGE.margin, 746, 499, 54, theme.accent, theme.line, theme.shadow)
  doc.text('CONTACT', 64, 768, 8, 'F2', theme.dark ? colors.linearText : colors.paper)
  doc.text(profile.person.email, 142, 768, 10, 'F2', theme.dark ? colors.linearText : colors.paper)
  doc.text(profile.links.github.value, 142, 784, 8.5, 'F1', theme.dark ? colors.linearText : colors.paper)

  return doc.finish()
}

export const buildCvPdf = (profile: Profile, variant: CvVariant) =>
  variant === 'general' ? drawGeneralCv(profile) : drawTargetedCv(profile, variant)
