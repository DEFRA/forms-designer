import('./server')
  .then((server) => server.listen())
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
