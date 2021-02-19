
const main = () => {
  const c = document.querySelector('#canvas')
  const canvas = Canvas.new(c)
  console.log(canvas)
  canvas.drawLine(Vector.new(50, 50), Vector.new(100, 100), Color.green())
  const mesh = Mesh.cube()
  canvas.drawMesh(mesh)

  setInterval(() => {
    canvas.clear()
    mesh.rotate(new Vector(0.005, 0.008, 0))
    // console.log('r', mesh.rotation)
    canvas.drawMesh(mesh, 3)
  }, 50)
}

main()
