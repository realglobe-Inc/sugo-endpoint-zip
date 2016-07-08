/** This is example of client */

'use strict'

const sugoAgentZip = require('sugo-agent-zip')
const co = require('co')

co(function * () {
  let agent = sugoAgentZip('/downloads')
  let knocked = yield agent.knock()
  /* .. */

  // Download the zip and save to file.
  yield agent.download('photos', 'tmp/downloads/photos.zip')
}).catch((err) => console.error(err))
