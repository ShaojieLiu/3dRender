const require = path => {
  const script = document.createElement('script')
  script.async = false
  script.defer = true
  script.src = path
  document.body.appendChild(script)
}
