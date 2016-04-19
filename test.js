'use strict'

var expect = require('expect.js');
var http = require('http');
var url = require('url');
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var request = require('request');

process.env.AWS_ACCESS_KEY_ID="dummy";
process.env.AWS_SECRET_ACCESS_KEY="sig";
process.env.AWS_REGION="us-east-1"

var iamProxy = require('./');
var remoteHost = 'http://127.0.0.1:7000'

var proxy = iamProxy({
  target: remoteHost
});

before(function(cb){
  proxy.start(cb);
})

after(function(cb){
  proxy.stop(cb);
});

// Remove all request event listeners after every test
afterEach(function() {
  reqBus.removeAllListeners('request');
});

// An event bus that emits a request event when ever the
// target/remote server receives a request
var reqBus = new EventEmitter2();
var proxyHost = 'http://127.0.0.1:'+proxy.options.port;

/*
 * Create a dummy remote host that we will forward requests to.
 * Fires a request event on the reqBus. Tests must listen and respond to this event
 */
var targetServer = http.createServer(function(req, res) {
  reqBus.emit('request', req, res);
}).listen(7000);

describe('IAM Proxy', function() {
  it('it should sign requests with aws credentails', function(done) {
    reqBus.once('request', function(req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      expect(req.headers['authorization']).not.to.be.empty();
      expect(req.headers['x-amz-date']).not.to.be.empty();
      return res.end();
    });

    request(proxyHost+'/random/path', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  })
});
