pg = require "pg"
_ = require "lodash"

debug = require('debug')('ultimate.db.posgresql');

_client = null
_done = null

connect = (defaultPostresqlConfig, cb)->
  pgConnecionString = 'postgres://'
  pgConnecionString += defaultPostresqlConfig.username
  pgConnecionString += ":" + defaultPostresqlConfig.password
  pgConnecionString += "@" + defaultPostresqlConfig.host
  pgConnecionString += "/" + defaultPostresqlConfig.db
  console.log pgConnecionString

  pg.connect pgConnecionString, (err, client, done) ->
    if err
      console.error('Connection error:'.cyan);
    else
      console.log('Connected to Posgresql:'.cyan);
      _client = client
      _done = done
      if cb
        cb client

register: (app)->
  app.pg = getClient

getClient = ->
  _client

done = ->
  _done

# Public API
exports.connect = connect
exports.getClient = getClient
exports.done = done
