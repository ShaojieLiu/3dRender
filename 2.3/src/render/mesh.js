class Mesh extends GObject {
  // 表示三维物体的类
  constructor() {
    super()

    this.position = Vector.new(0, 0, 0)
    this.rotation = Vector.new(0, 0, 0)
    this.scale = Vector.new(1, 1, 1)
    this.vertices = null
    this.indices = null
  }
  // 在原来的基础上旋转一下
  rotate(v) {
    const r = this.rotation.add(v)
    // const pi = Math.PI
    // let y = (r.y) % (2 * pi)
    // y = (y > pi) ? (y - 2 * pi) : y
    this.rotation = Vector.new(r.x, r.y, r.z)
  }
  // 返回一个正方体
  static cube() {
    // 8 points
    let points = [
      -1, 1, -1,     // 0
      1, 1, -1,     // 1
      -1, -1, -1,     // 2
      1, -1, -1,     // 3
      -1, 1, 1,      // 4
      1, 1, 1,      // 5
      -1, -1, 1,      // 6
      1, -1, 1,      // 7
    ]

    let vertices = []
    for (let i = 0; i < points.length; i += 3) {
      let v = Vector.new(points[i], points[i + 1], points[i + 2])
      let c = Color.randomColor()
      vertices.push(Vertex.new(v, c))
    }

    // 12 triangles * 3 vertices each = 36 vertex indices
    let indices = [
      // 12
      [0, 1, 2],
      [1, 3, 2],
      [1, 7, 3],
      [1, 5, 7],
      [5, 6, 7],
      [5, 4, 6],
      [4, 0, 6],
      [0, 2, 6],
      [0, 4, 5],
      [5, 1, 0],
      [2, 3, 7],
      [2, 7, 6],
    ]
    let m = this.new()
    m.vertices = vertices
    m.indices = indices
    return m
  }
}
