'use strict'

const { writeFile } = require('./fs')

const { deepAssign, omitBy, predicates: { isNil } } = require('../utils/object')

const defaultOptions                 = require('../etc/chart-config')
const { registerFont, createCanvas } = require('canvas')

registerFont(require.resolve('../assets/fonts/GT-Walsheim-Medium.ttf'), {
  family: 'WalsheimMedium'
})

registerFont(require.resolve('../assets/fonts/gt-walsheim-webfont.ttf'), {
  family: 'Walsheim'
})

const getLines = (ctx, text, maxWidth, font) => {
  if (!text) return []

  const words       = text.split(' ')
  const lines       = []
  let currentLine   = words[0]
  const wordsLength = words.length

  ctx.font = font

  for (let i = 1; i < wordsLength; i++) {
    const word  = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width

    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }

  lines.push(currentLine)

  return lines
}

const toLegendData = (ctx, data, maxWidth) => {
  const total = data.reduce((sum, { value }) => sum + value, 0)

  return data.map(item => ({
    lines  : getLines(ctx, item.name, maxWidth),
    percent: item.value ? (item.value / total * 100).toFixed(2) : 0,
    value  : item.value.toFixed(2),
    color  : item.color
  }))
}

const getRowHeight = (items, { lineHeight, item: { padding } }) => {
  const maxLinesCount = items.reduce((max, { lines }) => Math.max(max, lines.length), 0)

  return (maxLinesCount + 1) * lineHeight + 2 * padding
}

const drawLegendItem = (ctx, data, x, y, options) => {
  const { lineHeight, item: { padding } } = options

  ctx.fillStyle = 'black'

  // draw name
  data.lines.forEach((line, i) => {
    ctx.fillText(line, x + 30, y + (i + 1) * lineHeight)
  })

  // draw value
  ctx.fillText(`${data.percent} %`, x + 30, y + (data.lines.length + 1) * lineHeight)

  // draw color marker
  if (data.color) {
    ctx.fillStyle = data.color
    ctx.fillRect(x + padding / 2, y + 3, 8, (data.lines.length + 1) * lineHeight)
  }
}

const drawLegend = (ctx, data, options = {}) => {

  const { item: { padding }, fontSize, fontFamily, width } = options

  const columnsCount = options.columnsCount < data.length ? options.columnsCount : data.length
  const rowsCount    = Math.ceil(data.length / columnsCount)
  const itemWidth    = ~~(width / columnsCount)

  options.lineHeight = ~~(fontSize * 1.2)

  const font       = ctx.font = `${fontSize}px ${fontFamily}`
  const legendData = toLegendData(ctx, data, itemWidth - 2 * padding - 20)

  const rows = []

  for (let row = 0; row < rowsCount; row++) {
    const items  = legendData.slice(columnsCount * row, columnsCount * row + columnsCount)
    const height = getRowHeight(items, options)

    ctx.canvas.height += height

    rows.push({ items, height })
  }

  let prevY = 0

  ctx.font = font
  rows.forEach(row => {
    for (let column = 0; column < columnsCount; column++) {
      const item = row.items[column]

      if (item) {
        const x = itemWidth * column + padding
        const y = prevY + padding

        drawLegendItem(ctx, row.items[column], x, y, options)
      }

    }

    prevY += row.height
  })
}

const drawHeader = (ctx, data, options = {}) => {
  const { fontSize, width, padding } = options
  const lineHeight                   = ~~(fontSize * 1.2)
  const titleFont                    = `${fontSize}px WalsheimMedium`
  const descriptionFont              = `${fontSize}px Walsheim`

  const titleLines = getLines(ctx, data.title, width, titleFont)
  titleLines.push('')

  const descriptionLines = getLines(ctx, data.description, width, descriptionFont)

  ctx.canvas.height = (titleLines.length + descriptionLines.length) * lineHeight + 2 * padding

  ctx.fillStyle = 'black'

  const drawText = (lines, x, y, font) => {
    ctx.font = font

    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + (i + 1) * lineHeight)
    })
  }

  if (data.title) {
    drawText(titleLines, padding, padding, titleFont)
  }

  if (data.description) {
    drawText(descriptionLines, padding, padding + titleLines.length * lineHeight, descriptionFont)
  }

}

const drawDate = (ctx, date, options) => {
  const { fontSize } = options

  ctx.font = `${fontSize}px WalsheimMedium`

  const dateString = new Date(date).toLocaleDateString('en-EN', { year: 'numeric', month: 'short' })

  const { width: dateWidth } = ctx.measureText(dateString)
  const { width, height }    = ctx.canvas

  const x = ~~(width / 2 - dateWidth / 2)
  const y = ~~(height / 2 + fontSize / 2)

  ctx.fillStyle = 'black'
  ctx.fillText(dateString, x, y)
}

const drawChart = (ctx, data, options) => {

  let currAngle = (options.startAngle || 0) * Math.PI / 180
  const width   = options.width
  const height  = ctx.canvas.height = options.height || options.width / 1.5
  const radius  = ~~(Math.min(width, height) * .8 / 2)
  const center  = {
    x: width / 2,
    y: height / 2
  }

  const total = data.reduce((sum, { value }) => sum + value, 0)

  const getAngle = (currAngle, total, value) => currAngle + (value / total) * 2 * Math.PI

  const drawSector = (x, y, radius, startAngle, endAngle, color) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(center.x, center.y)
    ctx.arc(center.x, center.y, radius, startAngle, endAngle)
    ctx.fill()
  }

  data.forEach(item => {
    const angle = getAngle(currAngle, total, item.value)

    drawSector(center.x, center.y, radius, currAngle, angle, item.color)

    currAngle = angle
  })

  if (options.type === 'doughnut') {
    drawSector(center.x, center.y, radius * .7, 0, Math.PI * 2, options.background)
  }
}

const chart = {
  render({ data, date, header, width, height }) {
    const options = deepAssign({}, defaultOptions, omitBy({ width, height }, isNil))

    const headerCanvas = createCanvas(options.width)
    const chartCanvas  = createCanvas(options.width)
    const legendCanvas = createCanvas(options.width)

    headerCanvas.width = legendCanvas.width = chartCanvas.width = options.width

    drawHeader(headerCanvas.getContext('2d'), header, options.header)
    drawChart(chartCanvas.getContext('2d'), data, options)
    drawLegend(legendCanvas.getContext('2d'), data, options.legend)
    drawDate(chartCanvas.getContext('2d'), date, options.date)

    const containerCanvas = createCanvas(
      options.width,
      headerCanvas.height + chartCanvas.height + legendCanvas.height + 30
    )

    const ctx = containerCanvas.getContext('2d')

    this.clear(ctx, options)

    ctx.drawImage(headerCanvas, options.header.marginLeft, 0)
    ctx.drawImage(chartCanvas, 0, headerCanvas.height, options.width, chartCanvas.height)

    let legendCanvasX = options.legend.marginLeft

    if (options.legend.align === 'center') {
      legendCanvasX += ~~((options.width - options.legend.width) / 2)
    }

    if (options.legend.align === 'right') {
      legendCanvasX += options.width - options.legend.width
    }

    ctx.drawImage(legendCanvas, legendCanvasX, headerCanvas.height + chartCanvas.height)

    return containerCanvas
  },

  clear(ctx, options = {}) {
    ctx.fillStyle = options.background || 'white'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  },

  renderToFile(options, path) {
    const buffer = chart.renderToBuffer(options)

    return writeFile(path, buffer, 'binary')
  },

  renderToBuffer(options) {
    const data = chart.renderToDataURL(options)

    return Buffer.from(data.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  },

  renderToDataURL(options) {
    const canvas = chart.render(options)

    return canvas.toDataURL('image/png')
  }
}

module.exports = chart