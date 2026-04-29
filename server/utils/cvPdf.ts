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
  sectionTitle(doc, 'Stack')
  profile.stack.groups.forEach((group) => {
    doc.ensure(34)
    doc.text(group.label, PAGE.margin, doc.y, 10, 'F2', colors.dim)
    doc.text(group.items.join(' / '), 142, doc.y, 10, 'F1', colors.ink)
    doc.y += 22
  })

  doc.y += 12
  sectionTitle(doc, 'Education')
  doc.text(profile.track.education.field, PAGE.margin, doc.y, 11, 'F2')
  doc.text(profile.track.education.school, 220, doc.y, 10, 'F1', colors.dim)

  return doc.finish()
}

const phSection = (doc: PdfDoc, label: string, title: string) => {
  doc.ensure(70)
  doc.text(label.toUpperCase(), PAGE.margin, doc.y, 8, 'F2', colors.phOrange)
  doc.y = doc.textBlock(title, PAGE.margin, doc.y + 24, 500, 19, 23, { font: 'F4', color: colors.ink }) + 18
}

const drawPosthogCv = (profile: Profile) => {
  const doc = new PdfDoc('posthog')

  doc.panel(PAGE.margin, 52, 36, 36, colors.phOrange, colors.ink, true)
  doc.text(profile.person.initials, 58, 75, 12, 'F2', colors.paper)
  doc.text(profile.person.name, 98, 72, 17, 'F2')
  doc.text('Product Engineer / PostHog CV variant', 98, 90, 9, 'F1', colors.dim)
  doc.panel(392, 52, 155, 42, colors.phYellow, colors.ink, true)
  doc.text('DOWNLOAD.CV', 419, 78, 10, 'F2', colors.ink)

  doc.panel(PAGE.margin, 126, 499, 152, colors.paper, colors.ink, true)
  doc.fillRect(PAGE.margin, 126, 499, 32, [0.94, 0.89, 0.78])
  doc.line(PAGE.margin, 158, PAGE.width - PAGE.margin, 158, colors.ink, 1.5)
  doc.text(profile.posthog.hero.kicker, 64, 147, 8, 'F2', colors.ink)
  doc.textBlock(profile.posthog.hero.headline, 64, 190, 340, 26, 28, { font: 'F4', color: colors.ink })
  doc.textBlock(profile.posthog.hero.lead, 64, 246, 450, 9.5, 13, { color: colors.dim })
  doc.y = 318

  phSection(doc, profile.posthog.proof.kicker, profile.posthog.proof.heading)
  profile.posthog.proof.rows.forEach((row) => {
    doc.ensure(76)
    const startY = doc.y
    doc.panel(PAGE.margin, startY - 14, 499, 60, colors.paper, colors.ink, true)
    doc.text(row.label, 64, startY + 5, 8, 'F2', colors.phOrange)
    doc.textBlock(row.heading, 142, startY + 5, 210, 10.5, 13, { font: 'F2', color: colors.ink })
    doc.textBlock(row.description, 370, startY + 5, 150, 8.5, 11.5, { color: colors.dim })
    doc.y += 78
  })

  phSection(doc, profile.posthog.loop.kicker, profile.posthog.loop.heading)
  profile.posthog.loop.steps.forEach((step) => {
    doc.ensure(58)
    doc.text(step.label, PAGE.margin, doc.y, 18, 'F4', colors.ink)
    doc.y = doc.textBlock(step.description, 190, doc.y, 344, 10, 13, { color: colors.dim }) + 18
  })

  phSection(doc, profile.posthog.ideas.kicker, profile.posthog.ideas.heading)
  profile.posthog.ideas.items.forEach((item) => {
    doc.ensure(48)
    doc.text(`> ${item.label}`, PAGE.margin, doc.y, 10, 'F2', colors.phOrange)
    doc.y = doc.textBlock(item.description, 190, doc.y, 344, 9.5, 12.5, { color: colors.ink }) + 16
  })

  phSection(doc, 'Track record', profile.track.heading)
  profile.track.experience.forEach((item) => {
    doc.ensure(62)
    doc.text(item.year, PAGE.margin, doc.y, 8, 'F2', colors.dim)
    doc.text(`${item.role} / ${item.org}`, 142, doc.y, 11, 'F2', colors.ink)
    doc.y = doc.textBlock(item.description, 142, doc.y + 15, 392, 8.8, 11.5, { color: colors.dim }) + 16
    doc.line(PAGE.margin, doc.y - 7, PAGE.width - PAGE.margin, doc.y - 7, colors.ink, 0.75)
  })

  doc.ensure(80)
  doc.panel(PAGE.margin, doc.y, 499, 58, colors.phOrange, colors.ink, true)
  doc.text('CONTACT', 64, doc.y + 23, 8, 'F2', colors.paper)
  doc.text(profile.person.email, 142, doc.y + 23, 10, 'F2', colors.paper)
  doc.text(profile.links.github.value, 142, doc.y + 39, 9, 'F1', colors.paper)

  return doc.finish()
}

export const buildCvPdf = (profile: Profile, variant: CvVariant) =>
  variant === 'posthog' ? drawPosthogCv(profile) : drawGeneralCv(profile)
