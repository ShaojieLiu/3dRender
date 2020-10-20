class Matrix extends GObject {
  constructor(matrix_list) {
    super()
    if (matrix_list) {
      this.m = matrix_list
    } else {
      this.m = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
      ]
    }
  }
  toString() {
    let s = ''
    let m = this.m
    for (let i = 0; i < m.length; i++) {
      s += m[i].toFixed(3)
    }
    return s
  }
  multiply(other) {
    let m1 = this.m
    let m2 = other.m
    let m = []
    for (let index = 0; index < 16; index++) {
      let i = Math.floor(index / 4)
      let j = index % 4
      m[i * 4 + j] = m1[i * 4] * m2[j] + m1[i * 4 + 1] * m2[4 + j] + m1[i * 4 + 2] * m2[2 * 4 + j] + m1[i * 4 + 3] * m2[3 * 4 + j]
    }
    return Matrix.new(m)
  }
  static zero() {
    return this.new()
  }
  static identity() {
    m = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
    return this.new(m)
  }
  static lookAtLH(eye, target, up) {
    let zaxis = target.sub(eye).normalize()
    let xaxis = up.cross(zaxis).normalize()
    let yaxis = zaxis.cross(xaxis).normalize()

    let ex = -xaxis.dot(eye)
    let ey = -yaxis.dot(eye)
    let ez = -zaxis.dot(eye)

    let m = [
      xaxis.x, yaxis.x, zaxis.x, 0,
      xaxis.y, yaxis.y, zaxis.y, 0,
      xaxis.z, yaxis.z, zaxis.z, 0,
      ex, ey, ez, 1,
    ]
    return Matrix.new(m)
  }
  static perspectiveFovLH(field_of_view, aspect, znear, zfar) {
    let h = 1 / Math.tan(field_of_view / 2)
    let w = h / aspect
    let m = [
      w, 0, 0, 0,
      0, h, 0, 0,
      0, 0, zfar / (zfar - znear), 1,
      0, 0, (znear * zfar) / (znear - zfar), 0,
    ]
    return Matrix.new(m)
  }
  static rotationX(angle) {
    let s = Math.sin(angle)
    let c = Math.cos(angle)
    let m = [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ]
    return Matrix.new(m)
  }
  static rotationY(angle) {
    let s = Math.sin(angle)
    let c = Math.cos(angle)
    let m = [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ]
    return Matrix.new(m)
  }
  static rotationZ(angle) {
    let s = Math.sin(angle)
    let c = Math.cos(angle)
    let m = [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
    return Matrix.new(m)
  }
  static rotation(angle) {
    let x = Matrix.rotationZ(angle.z)
    let y = Matrix.rotationX(angle.x)
    let z = Matrix.rotationY(angle.y)
    return x.multiply(y).multiply(z)
  }
  static translation(v) {
    let { x, y, z } = v
    let m = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1,
    ]
    return Matrix.new(m)
  }
  transform(v) {
    let m = this.m
    let x = v.x * m[0] + v.y * m[1 * 4 + 0] + v.z * m[2 * 4 + 0] + m[3 * 4 + 0]
    let y = v.x * m[1] + v.y * m[1 * 4 + 1] + v.z * m[2 * 4 + 1] + m[3 * 4 + 1]
    let z = v.x * m[2] + v.y * m[1 * 4 + 2] + v.z * m[2 * 4 + 2] + m[3 * 4 + 2]
    let w = v.x * m[3] + v.y * m[1 * 4 + 3] + v.z * m[2 * 4 + 3] + m[3 * 4 + 3]

    return GuaVector.new(x / w, y / w, z / w)
  }
}
