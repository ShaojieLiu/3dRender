class Canvas extends GObject {
  constructor(canvas) {
    super(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  drawline(v1, v2, color) {
    const ctx = this.ctx
    ctx.beginPath()
    ctx.strokeStyle = color.toRgba()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.closePath()
    ctx.stroke()
  }
}
