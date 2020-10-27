class Canvas extends GObject {
  constructor(canvas) {
    super(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.w = canvas.width
    this.h = canvas.height
  }

  clear() {
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  project(coordVertex, transformMatrix = Matrix.identity()) {
    const { w, h } = this
    const [w2, h2] = [w / 2, h / 2]
    const point = transformMatrix.transform(coordVertex.position)
    const x = point.x * w2 + w2
    const y = - point.y * h2 + h2
    // const z = (point.z - 1.1) * 100000
    const z = point.z

    const v = Vector.new(x, y, z)
    return Vertex.new(v, this.color)
  }

  drawline(v1, v2, color) {
    // console.log('drawline', v1, v2)
    const ctx = this.ctx
    ctx.beginPath()
    ctx.strokeStyle = color.toRgba()
    ctx.moveTo(v1.x, v1.y)
    ctx.lineTo(v2.x, v2.y)
    ctx.closePath()
    ctx.stroke()
  }

  drawMesh(mesh, cameraIndex) {
    const { indices, vertices } = mesh
    const { w, h } = this

    let { position, target, up } = Camera.new(cameraIndex || 0)
    const view = Matrix.lookAtLH(position, target, up)
    const projection = Matrix.perspectiveFovLH(8, w / h, 0.1, 1)

    const rotation = Matrix.rotation(mesh.rotation)
    const translation = Matrix.translation(mesh.position)
    const world = rotation.multiply(translation)
    const transform = world.multiply(view).multiply(projection)

    console.log('transform', transform, world, rotation, translation)

    const color = Color.blue()
    indices.forEach(ind => {
      const [v1, v2, v3] = ind.map(i => {
        return this.project(vertices[i], transform).position
      })
      this.drawline(v1, v2, color)
      this.drawline(v2, v3, color)
      this.drawline(v1, v3, color)
    })
  }
}
