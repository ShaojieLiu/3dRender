class GObject {
  // 为了让所有类都可以使用 Class.new 来生成实例
  static new(...args) {
    return new this(...args)
  }
}
