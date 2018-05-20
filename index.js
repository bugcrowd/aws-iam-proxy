'use strict'

var proxilate = require('proxilate');
var url = require('url');
var AWS = require('aws-sdk');
var aws4 = require('aws4');
var _ = require('lodash');

module.exports = function(options) {
  var proxy = proxilate(options);
  proxy.register('backendFetch', function(req, res, options, cb) {
    var targetInfo = url.parse(options.target);
    var headers = _.clone(req.headers);
    headers.host = targetInfo.host;

    // Remove headers from forwarding request that will differ
    // in new request to backend. This is to help the AWS signature
    // to match
    delete headers['connection'];
    delete headers['x-forwarded-for'];
    delete headers['x-forwarded-proto'];
    delete headers['x-forwarded-port'];

    var opts = {
      host: targetInfo.host,
      path: req.originalUrl,
      method: req.method,
      headers: headers,
    }

    if (typeof req.body == 'string') {
      opts.body = req.body;
    }

    try {
      aws4.sign(opts);
    } catch(err) {
      cb(err);
    }

    req.headers = opts.headers;
    cb();
  });

  return proxy;
};
