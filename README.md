# jenkins-client

a simple NodeJS client for jenkins

<a href="https://nodei.co/npm/jenkins-client/"><img src="https://nodei.co/npm/jenkins-client.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/jenkins-client)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/jenkins-client/blob/master/LICENSE)

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

`buildResult` can return a stream and allows you to pipe data from the request

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

JenkinsClient.info(getInfo)

function getInfo (err, statusCode, payload) {
    // err - something went wrong
    // statusCode - theh http returning status code
    // the JSON payload from your jenkins server
}
```

### Development

##### this projet has been set up with a precommit that forces you to follow a code style, no jshint issues and 100% of code coverage before commit


to run test
```js
npm test
```

to run jshint
```js
npm run lint
```

to run code style
```js
npm run style
```

to run check code coverage
```js
npm run coverage:check
```

to open the code coverage report
```js
npm run coverage:open
```

to run the source complexity tool
```js
npm run complexity
```

to open the complexity report
```js
npm run complexity:open
```
