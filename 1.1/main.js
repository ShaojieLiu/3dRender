
const main = () => {
  const c = document.querySelector('#canvas')
  const canvas = Canvas.new(c)
  console.log(canvas)
  canvas.drawline(Vector.new(50, 50), Vector.new(100, 100), Color.green())
  canvas.drawMesh(Mesh.cube())
}

main()
