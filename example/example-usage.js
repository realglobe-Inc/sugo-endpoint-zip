/** This is an example to use sugo-endpoint-zip */

'use strict'

const sgServer = require('sg-server')

const server = sgServer({
  middlewares: [
    /* ... */
  ],
  endpoints: {
    'download/:filename': require('sugo-endpoint-zip')({
      // Options
    })
  }
})

server.listen(3000)

