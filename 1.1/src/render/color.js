class Color extends GObject {
  // 表示颜色的类
  constructor(r, g, b, a) {
    super()
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
  static newHex(hex) {
    hex = hex.replace('#', '')
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)
    let a = 255
    return this.new(r, g, b, a)
  }
  toRgba() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }
  interpolate(other, factor) {
    let c1 = this
    let c2 = other
    let r = c1.r + (c2.r - c1.r) * factor
    let g = c1.g + (c2.g - c1.g) * factor
    let b = c1.b + (c2.b - c1.b) * factor
    let a = c1.a + (c2.a - c1.a) * factor
    return GuaColor.new(r, g, b, a)
  }
  equal(c) {
    if (this.r === c.r && this.g === c.g && this.b === c.b && this.a === c.a) {
      return true
    }
    return false
  }
  // 随机颜色
  static randomColor() {
    // random01 是 utils.js 中的函数
    return this.new(random01() * 255, random01() * 255, random01() * 255, 1 * 255)
  }
  // 常见的几个颜色
  static black() {
    return this.new(0, 0, 0, 255)
  }
  static white() {
    return this.new(255, 255, 255, 255)
  }
  static transparent() {
    return this.new(0, 0, 0, 0)
  }
  static red() {
    return this.new(255, 0, 0, 255)
  }
  static green() {
    return this.new(0, 255, 0, 255)
  }
  static blue() {
    return this.new(0, 0, 255, 255)
  }
}
