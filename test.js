'use strict'
/*jshint -W030*/

const mocha = require('mocha')
const nock = require('nock')
const expect = require('chai').expect

const it = mocha.it
const describe = mocha.describe
const before = mocha.before
const afterEach = mocha.afterEach

const Client = require('./')

const URI     = 'http://misterjenkins.com'
const jobName = 'REEDNANLUBR'
const user    = 'Deckard'
const pwd     = 'B26354'

var scope

describe('jenkins-client', function() {

  before(function(done) {
    nock.disableNetConnect()
    done()
  })

  afterEach(function(done) {
    if (scope) {
      expect(scope.isDone()).to.be.true
    }
    done()
  })

  it('should throw an error if a timeout or fail connection happens',
    function(done) {
      Client(URI, user, pwd, jobName, {timeout: 500})
        .info(function(err, statusCode) {
          expect(err).to.be.exists
          expect(statusCode).to.be.undefined
          done()
        })
    }
  )

  it('should throw the corresponding statusCode when jenkins server ' +
    'returns an error',
    function(done) {
      scope = nock(URI)
        .get('/job/' + jobName + '/api/json')
        .reply(500)

      Client(URI, user, pwd, jobName)
        .info(function(err, statusCode) {
          expect(statusCode).to.be.equal(500)
          done()
        })
    }
  )

  it('should return a 200 when getting the job `status`', function(done) {
    scope = nock(URI)
      .get('/job/' + jobName + '/api/json')
      .reply(200, {})

    Client(URI, user, pwd, jobName)
      .info(function(err, statusCode, body) {
        expect(err).to.be.null
        expect(statusCode).to.be.equal(200)
        expect(body).to.be.an.object
        done()
      })
  })

  it('should return a 200 when getting the job `result`', function(done) {
    scope = nock(URI)
      .get('/job/' + jobName + '/1/consoleText')
      .reply(200, {})

    Client(URI, user, pwd, jobName)
      .buildResult(1, function(err, statusCode, body) {
        expect(err).to.be.null
        expect(statusCode).to.be.equal(200)
        expect(body).to.be.an.object
        done()
      })
  })

  it('should return an error when executing a job `build` with a ' +
    'bad payload to be send',
    function(done) {
      Client(URI, user, pwd, jobName)
        .buildResult('1', function(err, statusCode, body) {
          expect(err).to.be.exists
          expect(err.message).to.be.equal('"jobNumber" must be an integer!')
          expect(statusCode).to.be.undefined
          expect(body).to.be.undefined
          done()
        })
    }
  )

  it('should return a 200 when executing a job `build`', function(done) {
    var params2send = [
      {name: 'param1', value: 'value1'},
      {name: 'param2', value: 'value2'},
      {name: 'param3', value: 'value3'}
    ]

    var body = 'json=%7B%22parameter%22%3A%5B%7B%22name%22%3A%22param1%22%2' +
    'C%22value%22%3A%22value1%22%7D%2C%7B%22name%22%3A%22param2%22%2C%22val' +
    'ue%22%3A%22value2%22%7D%2C%7B%22name%22%3A%22param3%22%2C%22value%22%3' +
    'A%22value3%22%7D%5D%7D'

    scope = nock(URI)
      .post('/job/' + jobName + '/build?delay=0sec', body)
      .reply(201)

    Client(URI, user, pwd, jobName)
      .build(params2send, function(err, statusCode) {
        expect(err).to.be.null
        expect(statusCode).to.be.equal(201)
        done()
      })
  })

  it('should return an error when executing a job `build` with a ' +
    'bad payload to be send',
    function(done) {
      Client(URI, user, pwd, jobName)
        .build({}, function(err, statusCode, body) {
          expect(err).to.be.exists
          expect(err.message).to.be.equal('"parameters" must be an array!')
          expect(statusCode).to.be.undefined
          expect(body).to.be.undefined
          done()
        })
    }
  )
})
