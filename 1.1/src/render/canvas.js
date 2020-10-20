class Canvas extends GObject {
  constructor(canvas) {
    super(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.w = canvas.width
    this.h = canvas.height
  }

  drawline(v1, v2, color) {
    console.log('drawline', v1, v2)
    const ctx = this.ctx
    ctx.beginPath()
    ctx.strokeStyle = color.toRgba()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.closePath()
    ctx.stroke()
  }

  drawMesh(mesh) {
    const { indices, vertices } = mesh
    const position = Vector.new(400, 300, 0)
    const color = Color.blue()
    indices.forEach(ind => {
      const [v1, v2, v3] = ind.map(i => {
        return vertices[i].position.multi_num(30).add(position)
      })
      this.drawline(v1, v2, color)
      this.drawline(v2, v3, color)
      this.drawline(v1, v3, color)
    })
  }
}
