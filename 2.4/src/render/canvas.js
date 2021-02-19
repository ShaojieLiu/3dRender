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

    if (v.z > this.depthBuffer[index] + 0.0005) {
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

  drawTriangle(v1, v2, v3, color) {
    // 三个顶点根据Y值进行排序
    const [vUp, vMid, vDown] = [v1, v2, v3].sort((a, b) => a.y - b.y)
    // vUp和vDown连线被经过vMid的水平线切割的点, 称为vMag
    const vMag = vUp.interpolate(vDown, (vMid.y - vUp.y) / (vDown.y - vUp.y))

    for (let y = vUp.y; y < vDown.y; y++) {
      if (y < vMid.y) {
        // 三角形的上半部分
        const vUpMid = vUp.interpolate(vMid, (y - vUp.y) / (vMid.y - vUp.y))
        const vUpMag = vUp.interpolate(vMag, (y - vUp.y) / (vMag.y - vUp.y))
        this.drawLine(vUpMid, vUpMag, color)
      } else {
        // 三角形的下半部分
        const vDownMid = vDown.interpolate(vMid, (y - vDown.y) / (vMid.y - vDown.y))
        const vDownMag = vDown.interpolate(vMag, (y - vDown.y) / (vMag.y - vDown.y))
        this.drawLine(vDownMid, vDownMag, color)
      }
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
    const color1 = Color.green()

    indices.forEach((ind, i) => {
      const [v1, v2, v3] = ind.map(i => {
        return this.project(vertices[i], transform).position
      })

      this.drawLine(v1, v2, color)
      this.drawLine(v2, v3, color)
      this.drawLine(v3, v1, color)
      this.drawTriangle(v1, v2, v3, color1)
    })

    ctx.putImageData(new ImageData(this.dataBuffer, this.w, this.h), 0, 0)
  }
}

const colorArr = Array.from({length: 12}).map(() => Color.randomColor())
