# jenkins-client

a simple NodeJS client for jenkins

<a href="https://nodei.co/npm/jenkins-client/"><img src="https://nodei.co/npm/jenkins-client.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/jenkins-client)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/jenkins-client/blob/master/LICENSE)[![NodeJS](https://img.shields.io/badge/node-6.1.x-brightgreen.svg?style=flat-square)](https://github.com/joaquimserafim/get-loadavg/blob/master/package.json#L28)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## API

#### jenkins-client(uri, user, pwd, jobName, [, socketOptions])

* **uri** string, the URI for your jenkins server
* **user** string, the user to access jenkins
* **pwd** string, the password for the user
* **jobName** string, the job name we want 
* **socketOptions** a js object, right now only accepts the *timeout* property (default to 10 seconds)


#### jenkins-client#info(callback(err, statusCode, payload))
returns the info about the job

* **callback**
    - *err* an error object
    - *statusCode* an integer, the returning status code
    - *payload* a JSON, the job info

#### jenkins-client#build([parameters,] callback(err, statusCode))
runs a new build for that job

* **parameters** should be an array, not required
    - here goes the parameters needed for the job to run if is the case
* **callback**
    - *err* an error object
    - *statusCode* an integer, the returning status code

#### jenkins-client#buildResult(jobNumber, callback(err, statusCode, payload))
returns the output from the build

* **jobNumber** should be an integer, required
* **callback**
    - *err* an error object
    - *statusCode* an integer, the returning status code
    - *payload* a string but ... depends of the the job output 

`buildResult` can return a stream and allows you to pipe the data from the request, the best option

```js
var st = Client(URI, user, pwd, jobName).buildResult(1)
st.on('end', end)
st.on('error', error)

st.pipe(process.stdout)

// or using the event `data`
st.on('data', data)
```


##### example
```js
var JenkinsClient = require('jenkins-client')


var jobX = JenkinsClient(uri, user, pwd, jobName[, socketOptions])

jobX.info(getInfo)

function getInfo (err, statusCode, payload) {
    // err - something went wrong
    // statusCode - the http returning status code
    // the JSON payload from your jenkins server
}
```

### ISC License
