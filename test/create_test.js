/**
 * Test case for create.
 * Runs with mocha.
 */
'use strict'

const create = require('../lib/create.js')
const co = require('co')
const fs = require('fs')
const sgServer = require('sg-server')
const arequest = require('arequest')
const asleep = require('asleep')
const aport = require('aport')
const mkdirp = require('mkdirp')
const assert = require('assert')

describe('create', function () {
  this.timeout(4000)
  let server, baseUrl
  let request = arequest.create()
  before(() => co(function * () {
    mkdirp.sync(`${__dirname}/../tmp/`)
    let endpoint = create(`${__dirname}/../misc/mocks`)
    assert.ok(endpoint)
    let port = yield aport()
    server = sgServer({
      endpoints: {
        '/downloads/:filename': endpoint
      }
    })
    baseUrl = `http://localhost:${port}`
    yield server.listen(port)
  }))

  after(() => co(function * () {
    yield asleep(10)
    yield server.close()
  }))

  it('Send a request', () => co(function * () {
    let writeStream = fs.createWriteStream(`${__dirname}/../tmp/foo.zip`)
    let { statusCode } = yield request({
      method: 'GET',
      url: `${baseUrl}/downloads/foo`,
      encode: null,
      pipe: writeStream
    })
    assert.equal(statusCode, 200)
  }))
})

/* global describe, before, after, it */
