class Canvas extends GObject {
  constructor(canvas) {
    super(canvas)
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.w = canvas.width
    this.h = canvas.height
    // 初始化加多以下两行
    this.initBuffer()
  }

  initBuffer() {
    this.dataBuffer = new Uint8ClampedArray(this.w * this.h * 4)
    this.depthBuffer = Array.from({ length: this.w * this.h }).map(() => -255535)
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

  drawPoint(v, color) {
    const x = Math.round(v.x)
    const y = Math.round(v.y)
    const index = x + y * this.w

    if (v.z > this.depthBuffer[index]) {
      this.depthBuffer[index] = v.z
      this.dataBuffer[index * 4 + 0] = color.r
      this.dataBuffer[index * 4 + 1] = color.g
      this.dataBuffer[index * 4 + 2] = color.b
      this.dataBuffer[index * 4 + 3] = color.a
    }
  }

  drawLine(v1, v2, color) {
    const delta = v1.sub(v2)
    const deltaX = Math.abs(delta.x)
    const deltaY = Math.abs(delta.y)
    const len = deltaX > deltaY ? deltaX : deltaY

    for (let i = 0; i < len; i++) {
      const p = v1.interpolate(v2, i / len)
      this.drawPoint(p, color)
    }
  }

  getTransform(mesh, cameraIndex) {
    const { w, h } = this

    let { position, target, up } = Camera.new(cameraIndex || 0)
    const view = Matrix.lookAtLH(position, target, up)
    const projection = Matrix.perspectiveFovLH(8, w / h, 0.1, 1)

    const rotation = Matrix.rotation(mesh.rotation)
    const translation = Matrix.translation(mesh.position)
    const world = rotation.multiply(translation)
    const transform = world.multiply(view).multiply(projection)

    return transform
  }

  drawMesh(mesh, cameraIndex) {
    this.initBuffer()

    const { indices, vertices } = mesh
    const transform = this.getTransform(mesh, cameraIndex)
    const ctx = this.ctx
    const color = Color.blue()

    indices.forEach((ind, i) => {
      const [v1, v2, v3] = ind.map(i => {
        return this.project(vertices[i], transform).position
      })

      this.drawLine(v1, v2, color)
      this.drawLine(v2, v3, color)
      this.drawLine(v3, v1, color)
    })

    ctx.putImageData(new ImageData(this.dataBuffer, this.w, this.h), 0, 0)
  }
}
