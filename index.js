/*
eslint
no-multi-spaces: ["error", {exceptions: {"VariableDeclarator": true}}]
padded-blocks: ["error", {"classes": "always"}]
max-len: ["error", 80]
*/
'use strict'

const request = require('superagent')

module.exports = Client

function Client (uri, user, pwd, job, socketConfig = {timeout: 10000}) {
  if (!(this instanceof Client)) {
    return new Client(uri, user, pwd, job, socketConfig)
  }

  this._uri = uri
  this._user = user
  this._pwd = pwd
  this._job = job
  this._timeout = socketConfig.timeout
}

Client.prototype.info = function info (cb) {

  request
    .get(this._uri + '/job/' + this._job + '/api/json')
    .timeout(this._timeout)
    .auth(this._user, this._pwd)
    .end(handler(cb))
}

//
// if pass a `callback` then should use the superagent `end` method
// to retrieve the data or should return a stream where the client
// can pipe and listen for events
//

Client.prototype.buildResult = function buildResult (jobNumber, cb) {
  if (!isInteger(jobNumber)) {
    cb(new Error('"jobNumber" must be an integer!'))
  }

  var req = request
    .get(this._uri + '/job/' + this._job + '/' + jobNumber + '/consoleText')
    .timeout(this._timeout)
    .auth(this._user, this._pwd)

  return !cb ? req : req.end(handler(cb))
}

Client.prototype.build = function build (parameters, cb) {

  if (!Array.isArray(parameters)) {
    return cb(new Error('"parameters" must be an array!'))
  }

  var formData = JSON.stringify({parameter: parameters})

  request
    .post(this._uri + '/job/' + this._job + '/build')
    .timeout(this._timeout)
    .query({delay: '0sec'})
    .type('form')
    .send({json: formData})
    .auth(this._user, this._pwd)
    .end(handler(cb))
}

//
// helpers
//

function handler (cb) {

  return function handlerFn (err, res) {
    if (err) {
      cb(new Error(err.message), err.status, res && res.headers)
    } else {
      cb(null, res.status, res.body, res.headers)
    }
  }
}

function isInteger (n) {
  return Number(n) === n && n % 1 === 0
}
