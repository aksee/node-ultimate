debug = require('debug')('ultimate.db.arango');
arango = require('arangojs');




connect = (defaultConfig, cb)->
  db = new arango({url: defaultConfig.host + ":" + defaultConfig.port})
  db.useDatabase defaultConfig.db
  cb null, db


# Public API
exports.connect = connect
