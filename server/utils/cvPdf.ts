type Profile = typeof import('../../app/data/profile').profile
type CvVariant = 'general' | 'posthog'
type Color = [number, number, number]

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
  phGreen: [0.302, 0.553, 0.353] as Color
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

  addPage() {
    if (this.ops.length) {
      this.pages.push(this.ops.join('\n'))
    }

    this.ops = []
    this.y = 60
    this.fillRect(0, 0, PAGE.width, PAGE.height, this.variant === 'posthog' ? colors.phBg : colors.bg)

    if (this.variant === 'posthog') {
      for (let x = 0; x <= PAGE.width; x += 36) {
        this.line(x, 0, x, PAGE.height, [0.89, 0.86, 0.78], 0.35)
      }

      for (let y = 0; y <= PAGE.height; y += 36) {
        this.line(0, y, PAGE.width, y, [0.89, 0.86, 0.78], 0.35)
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
  doc.text(profile.person.role, PAGE.margin, 112, 12, 'F1', colors.dim)
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

  if (lines.length > maxLines && visibleLines.length) {
    const lastIndex = visibleLines.length - 1
    const suffix = '...'
    let shortened = visibleLines[lastIndex]

    while (shortened.length > 1 && approxTextWidth(`${shortened}${suffix}`, size, options.font) > width) {
      shortened = shortened.slice(0, -1).trim()
    }

    visibleLines[lastIndex] = `${shortened}${suffix}`
  }

  visibleLines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight, size, options.font ?? 'F1', options.color ?? colors.ink)
  })

  return y + visibleLines.length * lineHeight
}

const posthogHeader = (doc: PdfDoc, profile: Profile, subtitle = 'Product Engineer / PostHog CV variant') => {
  doc.panel(PAGE.margin, 42, 32, 32, colors.phOrange, colors.ink, true)
  doc.text(profile.person.initials, 57, 64, 11, 'F2', colors.paper)
  doc.text(profile.person.name, 94, 60, 16, 'F2')
  doc.text(subtitle, 94, 77, 8, 'F1', colors.dim)
  doc.text('POSTHOG CV', 471, 58, 8, 'F2', colors.dim)
  doc.text('2 pages', 500, 74, 7, 'F1', colors.dim)
}

const posthogCard = (doc: PdfDoc, x: number, y: number, width: number, height: number) => {
  doc.panel(x, y, width, height, colors.paper, colors.ink, true)
}

const drawPosthogCv = (profile: Profile) => {
  const doc = new PdfDoc('posthog')

  posthogHeader(doc, profile)

  const heroY = 96
  posthogCard(doc, PAGE.margin, heroY, 499, 124)
  doc.fillRect(PAGE.margin, heroY, 499, 25, [0.94, 0.89, 0.78])
  doc.line(PAGE.margin, heroY + 25, PAGE.width - PAGE.margin, heroY + 25, colors.ink, 1.4)
  doc.text(profile.posthog.hero.kicker, 64, heroY + 17, 7.5, 'F2', colors.ink)
  compactTextBlock(doc, profile.posthog.hero.headline, 64, heroY + 55, 285, 18, 20, 3, {
    font: 'F4',
    color: colors.ink
  })
  doc.text('WHY', 376, heroY + 54, 7, 'F2', colors.phOrange)
  compactTextBlock(doc, profile.posthog.hero.lead, 376, heroY + 72, 135, 8, 10.5, 5, { color: colors.dim })

  doc.text(profile.posthog.proof.kicker.toUpperCase(), PAGE.margin, 252, 8, 'F2', colors.phOrange)
  compactTextBlock(doc, profile.posthog.proof.heading, PAGE.margin, 274, 366, 15.5, 17.5, 2, {
    font: 'F4',
    color: colors.ink
  })

  const proofCardWidth = 242
  profile.posthog.proof.rows.forEach((row, index) => {
    const column = index % 2
    const rowIndex = Math.floor(index / 2)
    const x = PAGE.margin + column * (proofCardWidth + 15)
    const y = 326 + rowIndex * 80

    posthogCard(doc, x, y, proofCardWidth, 66)
    doc.text(row.label.toUpperCase(), x + 12, y + 17, 7, 'F2', colors.phOrange)
    compactTextBlock(doc, row.heading, x + 12, y + 33, proofCardWidth - 24, 8.4, 10, 2, {
      font: 'F2',
      color: colors.ink
    })
    compactTextBlock(doc, row.description, x + 12, y + 54, proofCardWidth - 24, 7, 8.8, 1, { color: colors.dim })
  })

  doc.text(profile.posthog.loop.kicker.toUpperCase(), PAGE.margin, 592, 8, 'F2', colors.phOrange)
  compactTextBlock(doc, profile.posthog.loop.heading, PAGE.margin, 615, 190, 16, 18, 2, {
    font: 'F4',
    color: colors.ink
  })
  profile.posthog.loop.steps.forEach((step, index) => {
    const y = 586 + index * 45
    doc.panel(258, y, 289, 35, colors.paper, colors.ink)
    doc.text(step.label, 272, y + 16, 9.2, 'F2', colors.ink)
    compactTextBlock(doc, step.description, 350, y + 14, 178, 7.3, 9, 2, { color: colors.dim })
  })

  doc.addPage()
  posthogHeader(doc, profile, 'Product Engineer / compact CV')

  doc.text(profile.posthog.ideas.kicker.toUpperCase(), PAGE.margin, 104, 8, 'F2', colors.phOrange)
  compactTextBlock(doc, profile.posthog.ideas.heading, PAGE.margin, 126, 310, 15.5, 18, 2, {
    font: 'F4',
    color: colors.ink
  })

  profile.posthog.ideas.items.forEach((item, index) => {
    const column = index % 2
    const rowIndex = Math.floor(index / 2)
    const x = PAGE.margin + column * (proofCardWidth + 15)
    const y = 186 + rowIndex * 78

    doc.panel(x, y, proofCardWidth, 62, colors.paper, colors.ink)
    compactTextBlock(doc, `> ${item.label}`, x + 12, y + 18, 92, 7.8, 9.6, 2, {
      font: 'F2',
      color: colors.phOrange
    })
    compactTextBlock(doc, item.description, x + 112, y + 18, proofCardWidth - 126, 7.6, 9.4, 4, { color: colors.ink })
  })

  doc.text('TRACK RECORD', PAGE.margin, 366, 8, 'F2', colors.phOrange)
  compactTextBlock(doc, profile.track.heading, PAGE.margin, 388, 430, 15, 17, 2, {
    font: 'F4',
    color: colors.ink
  })

  profile.track.experience.slice(0, 5).forEach((item, index) => {
    const y = 448 + index * 54
    doc.text(item.year, PAGE.margin, y, 7.2, 'F2', colors.dim)
    doc.text(`${item.role} / ${item.org}`, 142, y, 9, 'F2', colors.ink)
    compactTextBlock(doc, item.description, 142, y + 13, 375, 7.4, 9.2, 3, { color: colors.dim })
    doc.line(PAGE.margin, y + 43, PAGE.width - PAGE.margin, y + 43, colors.ink, 0.65)
  })

  doc.panel(PAGE.margin, 746, 499, 54, colors.phOrange, colors.ink, true)
  doc.text('CONTACT', 64, 768, 8, 'F2', colors.paper)
  doc.text(profile.person.email, 142, 768, 10, 'F2', colors.paper)
  doc.text(profile.links.github.value, 142, 784, 8.5, 'F1', colors.paper)

  return doc.finish()
}

export const buildCvPdf = (profile: Profile, variant: CvVariant) =>
  variant === 'posthog' ? drawPosthogCv(profile) : drawGeneralCv(profile)
