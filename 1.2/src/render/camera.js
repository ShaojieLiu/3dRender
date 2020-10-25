class Camera extends GObject {

  constructor(index) {
    super()
    this.init(index)
  }

  init(index) {
    const dict = {
      0: () => {
        this.position = Vector.new(0, 0, -10)
        this.target = Vector.new(0, 0, 0)
        this.up = Vector.new(0, 1, 0)
      },
      1: () => {
        this.position = Vector.new(0, 0, -5)
        this.target = Vector.new(0, 2, 0)
        this.up = Vector.new(0, 1, 0)
      },
      2: () => {
        this.position = Vector.new(0, 40, -100)
        this.target = Vector.new(0, 0, 0)
        this.up = Vector.new(0, 1, 0)
      },
      3: () => {
        this.position = Vector.new(0, 0, -5)
        this.target = Vector.new(0, 0, 0)
        this.up = Vector.new(0, 1, 0)
      },
    }
    dict[index || 0]()
  }
}
