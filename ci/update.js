#!/usr/bin/env node

/**
 * Update project.
 */

'use strict'

process.chdir(`${__dirname}/..`)

const { endpointUpdate } = require('sugos-ci')

endpointUpdate({})