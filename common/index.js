const require = path => {
  const script = document.createElement('script')
  script.defer = true
  script.src = path
  document.body.appendChild(script)
}
