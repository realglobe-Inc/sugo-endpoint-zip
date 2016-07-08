/**
 * Endpoint to download files as zip
 * @function sugoEndpointZip
 * @param {object} [options] - Optional settings.
 * @returns {function} - Defined app function.
 */

'use strict'

const co = require('co')
const path = require('path')
const aslock = require('aslock')
const { zip } = require('azip')
const { existsAsync } = require('asfs')
const debug = require('debug')('sugo:endpoint:zip')

/** @lends sugoEndpointZip */
function create (dirname, options = {}) {
  dirname = path.resolve(dirname)
  let lock = aslock.create({})

  function read (filename) {
    return lock.transaction(filename, () => co(function * () {
      return zip.stream(filename)
    }))
  }

  return [
    co.wrap(function * validate (ctx, next) {
      let { data } = ctx.request.body
      let { params } = ctx
      let filename = path.resolve(dirname, params.filename)
      let traversal = filename.indexOf(dirname) !== 0
      ctx.state = Object.assign(ctx.state || {}, {
        filename, data
      })
      if (traversal) {
        ctx.status = 400
        ctx.body = {
          errors: [ create.traversalError() ]
        }
        return
      }
      yield next()
    }),
    {
      /**
       * Description of this middleware.
       */
      $desc: 'Endpoint to serve zip.',
      /** Get file content */
      'GET': co.wrap(function * middleware (ctx) {
        debug('handle')
        let { filename } = ctx.state
        let exists = yield existsAsync(filename)
        if (!exists) {
          ctx.status = 404
          return
        }
        let stream = yield read(filename)
        ctx.body = stream
        stream.finalize()
      })
    }
  ]
}

Object.assign(create, {
  traversalError () {
    return {
      title: 'DIRECTORY_TRAVERSAL_DETECTED',
      detail: 'Invalid filename',
      source: {
        pointer: 'params/filename'
      }
    }
  }
})

module.exports = create
