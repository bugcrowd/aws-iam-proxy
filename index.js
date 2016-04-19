'use strict'

var proxilate = require('proxilate');
var url = require('url');
var AWS = require('aws-sdk');
var aws4 = require('aws4');
var _ = require('lodash');

// Pull credentials from AWS metadata api or env variables
var chain = new AWS.CredentialProviderChain();

module.exports = function(options) {
  var proxy = proxilate(options);
  proxy.register('backendFetch', function(req, res, options, cb) {
    chain.resolve(function(err, credentials) {
      if (err) {
        err.message = "AWS credentials chain: "+err.message
        return cb(err);
      }

      var targetInfo = url.parse(options.target);
      var headers = _.clone(req.headers);
      headers.host = targetInfo.host;

      var opts = {
        host: targetInfo.host,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        headers: headers
      }

      var creds = {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken
      }

      var signer = aws4.sign(opts, creds);
      req.headers = signer.headers;
      cb();
    });
  });

  return proxy;
};
