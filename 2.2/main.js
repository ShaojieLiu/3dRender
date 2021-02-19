
const main = () => {
  const c = document.querySelector('#canvas')
  const ctx = c.getContext('2d')
  const w = c.width
  const h = c.height
  let d = new Uint8ClampedArray(w * h * 4)

  const getData = t => {
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        d[i * 4 * w + j * 4 + 0] = 255 / w * j
        d[i * 4 * w + j * 4 + 1] = 255 / h * i
        d[i * 4 * w + j * 4 + 2] = Math.abs(t - 255)
        d[i * 4 * w + j * 4 + 3] = 255
      }
    }
    const data = new ImageData(d, w, h)
    return data
  }

  let time = 0
  setInterval(() => {
    ctx.putImageData(getData(time), 0, 0)
    time = (time + 1) % 512
  }, 10)
}

main()
