'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Levels = exports.Modes = exports.logstashClientTransport = exports.browserSerializer = exports.detectBrowser = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _browserBunyan = require('browser-bunyan');

var _fp = require('lodash/fp');

var _detectBrowser = require('detect-browser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var detectBrowser = exports.detectBrowser = _detectBrowser.detect;

var browserSerializer = exports.browserSerializer = function browserSerializer(browser) {
  var info = {
    browserName: browser.name,
    browserVersion: browser.version,
    OS: browser.os
  };
  return info;
};

var logstashClientTransport = exports.logstashClientTransport = function logstashClientTransport(logstashHost) {
  try {
    var writeStream = {
      write: function write(rec) {
        var _this = this;

        var formattedStream = {
          name: rec.name,
          '@timestamp': rec.time,
          level: rec.levelName,
          message: rec.msg
        };
        fetch(logstashHost, {
          method: 'PUT',
          body: JSON.stringify(_extends({}, rec, formattedStream)),
          headers: new Headers({
            'content-type': 'application/json'
          })
        }).then(function (res) {
          if (!res.ok) {
            console.log('Error:', _this.level + ' message was not delivered to Kibana at ' + _this.timestamp);
          }
        });
      }
    };
    return writeStream;
  } catch (error) {
    console.log('Error in Logger Logstash Stream ' + error);
  }
};

var Modes = exports.Modes = {
  console: 'console',
  logstash: 'logstash'
};

var Levels = exports.Levels = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error'
};

var isValidMode = function isValidMode(mode) {
  return Modes[mode];
};
var isValidLevel = function isValidLevel(level) {
  return Levels[level];
};

var Logger = function Logger(name) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Modes.console;
  var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Levels.warn;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  (0, _assert2.default)(isValidMode(mode), 'Invalid logger mode');
  (0, _assert2.default)(isValidLevel(level), 'Invalid logger level');
  (0, _assert2.default)((0, _fp.isString)(name), 'Invalid logger name');
  if (options.logstashHost) {
    (0, _assert2.default)((0, _fp.isString)(options.logstashHost), 'Invalid logstashHost property in Logger options');
  }
  if (options.serializers) {
    (0, _assert2.default)((0, _fp.isObject)(options.serializers), 'Invalid serializers property in Logger options');
  }
  var setStream = function setStream(mode) {
    if (mode !== 'console') {
      var _stream = logstashClientTransport(options.logstashHost);
      return _stream;
    }
    var stream = new _browserBunyan.ConsoleFormattedStream();
    return stream;
  };
  return (0, _browserBunyan.createLogger)({
    name: name,
    level: level,
    streams: [{
      level: level,
      stream: setStream(mode)
    }],
    serializers: _extends({}, options.serializers)
  });
};

exports.default = Logger;
