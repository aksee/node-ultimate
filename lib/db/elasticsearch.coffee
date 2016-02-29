request = require "request"

debug = require('debug')('ultimate.db.elasticsearch');


_client = null
_done = null

class EsApi
  url: null
  defaultParams: null
  constructor: (config)->
    @url = config.protocol + "://" + config.host + ":" + config.port + "/" + config.index_name

  post: (path, body, cb)->
    params =
      method: "POST"
      json: true
      uri: @url + "/" + path
    if typeof body == "function"
      cb = body
    else if body?
      params.json = body

    request params, cb

  get: (path, body, cb)->
    params =
      method: "GET"
      json: true
      uri: @url + "/" + path

    if typeof body == "function"
      cb = body
    else if body?
      params.json = body

    request params, cb
  put: (path, body, cb)->
    params =
      method: "PUT"
      json: true
      uri: @url + "/" + path
    if typeof body == "function"
      cb = body
    else if body?
      params.json = body

    request params, cb
  delete: (path, body, cb)->
    if typeof body == "function"
      cb = body

    params =
      method: "DELETE"
      json: true
      uri: @url + "/" + path

    if typeof body == "function"
      cb = body
    else if body?
      params.json = body

    request params, cb


connect = (defaultElasticSearchConfig, cb)->
  es = new EsApi(defaultElasticSearchConfig)
  cb null, es


# Public API
exports.connect = connect
