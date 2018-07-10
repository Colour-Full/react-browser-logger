# Browser-side logger

Browser-side logging for SPAs, logs in console by default. In `logstash` mode it will send the logs to Kibana via logstash

### Installing

Add the module to your dependencies using yarn

```bash
yarn add git https://github.com/Colour-Full/react-browser-logger.git
```

## How to use the logger 

Import the logger in your app 

```js
import Logger from 'rulsoft-browser-logger'
```
## Setting up your logger

The logger accepts the following arguments

```js
const logger = Logger('name', 'mode', 'level', {options})
```

1. *name* - string (required) - name of the logger
2. *mode* - string (required) - by default is set to `development` this will log in the browser console. In `production` the *logger* will log to Kibana
3. *level* - string (required) - the logger follow the bunyan log levels. Setting a logger instance (or one of its streams) to a particular level implies that all log records at that level and above are logged. E.g. a logger set to level "info" will log records at level info and above (warn, error, fatal). At the moment the level need's to be passed as a string but this can (and probably should) be changed to a number in future versions for easier management and testability

- "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
- "warn" (40): A note on something that should probably be looked at by an operator eventually.
- "info" (30): Detail on regular operation.
- "debug" (20): Anything else, i.e. too verbose to be included in "info" level.

4. *'options'* - object (optional)- you can pass the following options:

- 'logstashHost'  - string - a logstash url to send the log's to
- 'serializers' - object - the logger follows the Bunyan concept of "serializers" to produce a JSON-able object from a JavaScript object, so you can easily do the following:

```js
log.info({req: <request object>}, 'something about handling this request')
```

The logger comes with browser serializer that uses the `detect-browser` npm module and will log the browser name, version and OS, out of the box. You can use it like this:

```js
import Logger from 'rulsoft-browser-logger'

// define your logger
const logger = Logger(serviceName, 'console', 'info'}

// You can access the browser data from the logger by using
const browser = logger.browser

// And then in your logger pass the browser object like this
logger.info({browser: browser}, 'Some info with browser details')

```

You can override the default browser or you can write your own serializers like this:

```js
import Logger from 'rulsoft-browser-logger'

const someUser = {
// Some object containig data for a user that you want to log
}

function userSerializer(someUser) {
    return {
        name: someUser.name,
        addres: someUser.addres,
        phone: someUser.phone
    }
}

const logger = Logger('someLogger', 'console', 'info', { logstashHost: 'http://logstashHost', serializers: {user: userSerializer} })

logger.info({user: someUser}, 'Something happened')

```

## Running the tests

TODO there are currently no test we will need to add some

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Built With

* [browser-bunyan](https://www.npmjs.com/package/browser-bunyan) - This package is an adaptation of, the Node logging library, Bunyan but specifically for the browser.
* [lodash/fp](https://lodash.com/) A modern JavaScript utility library delivering modularity, performance & extras. 
* [detect-browser](https://github.com/DamonOehlman/detect-browser) This is a package that attempts to detect a browser vendor and version (in a semver compatible format) using a navigator useragent in a browser or process.version in node.

## Versioning

TODO - we need to agree on that

## Authors

Rullion Solutions 
