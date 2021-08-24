AWS IAM Proxy
=============

This proxy signs requests with AWS IAM credentials. It will search for IAM credentials from the AWS metadata api and environment variables. Useful if you wish to expose aws services to clients that can not sign their requests.

Dependencies
------------
- nodejs
- npm

Installation
------------

**NOTE:** We have moved the package under our `bugcrowd` NPM organization - this will be the only package location maintained going forward.

`$ npm install @bugcrowd/aws-iam-proxy -g`

Usage
-----

`$ aws-iam-proxy`

Supported ENV variables:
- AWS_ENDPOINT (required)
  The AWS service you want to point this reverse proxy at.

- PORT (optional, default 8000)
  The port to run this proxy on

- PROXY_USERNAME (optional)
  Basic Auth username to protect this proxy with

- PROXY_PASSWORD (optional)
  Basic Auth password to protect this proxy with

- AWS_ACCESS_KEY_ID (optional)

- AWS_SECRET_ACCESS_KEY (optional)

- AWS_REGION (optional)
