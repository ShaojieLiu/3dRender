class Vertex extends GObject {
  // 表示顶点的类, 包含 Vector 和 Color
  // 表示了一个坐标和一个颜色
  constructor(position, color) {
    super()
    this.position = position
    this.color = color
  }
  interpolate(other, factor) {
    let a = this
    let b = other
    let p = a.position.interpolate(b.position, factor)
    let c = a.color ? a.color.interpolate(b.color, factor) : null
    return Vertex.new(p, c)
  }
  // drawTriangleLine
  project(transformMatrix) {
    let { w, h } = this
    let [w2, h2] = [w / 2, h / 2]
    let point = transformMatrix.transform(coordVector.position)
    let x = point.x * w2 + w2
    let y = - point.y * h2 + h2
    let z = (point.z - 1.1) * 100000

    let v = Vector.new(x, y, z)
    return Vertex.new(v, this.color)
  }
}
