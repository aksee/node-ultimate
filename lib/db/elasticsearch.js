// Generated by CoffeeScript 1.9.3
(function() {
  var EsApi, _client, _done, connect, debug, request;

  request = require("request");

  debug = require('debug')('ultimate.db.elasticsearch');

  _client = null;

  _done = null;

  EsApi = (function() {
    EsApi.prototype.url = null;

    EsApi.prototype.defaultParams = null;

    function EsApi(config) {
      this.url = config.protocol + "://" + config.host + ":" + config.port + "/" + config.index_name;
    }

    EsApi.prototype.post = function(path, body, cb) {
      var params;
      params = {
        method: "POST",
        json: true,
        uri: this.url + "/" + path
      };
      if (typeof body === "function") {
        cb = body;
      } else if (body != null) {
        params.json = body;
      }
      return request(params, cb);
    };

    EsApi.prototype.get = function(path, body, cb) {
      var params;
      params = {
        method: "GET",
        json: true,
        uri: this.url + "/" + path
      };
      if (typeof body === "function") {
        cb = body;
      } else if (body != null) {
        params.json = body;
      }
      return request(params, cb);
    };

    EsApi.prototype.put = function(path, body, cb) {
      var params;
      params = {
        method: "PUT",
        json: true,
        uri: this.url + "/" + path
      };
      if (typeof body === "function") {
        cb = body;
      } else if (body != null) {
        params.json = body;
      }
      return request(params, cb);
    };

    EsApi.prototype["delete"] = function(path, body, cb) {
      var params;
      if (typeof body === "function") {
        cb = body;
      }
      params = {
        method: "DELETE",
        json: true,
        uri: this.url + "/" + path
      };
      if (typeof body === "function") {
        cb = body;
      } else if (body != null) {
        params.json = body;
      }
      return request(params, cb);
    };

    return EsApi;

  })();

  connect = function(defaultElasticSearchConfig, cb) {
    var es;
    es = new EsApi(defaultElasticSearchConfig);
    return cb(null, es);
  };

  exports.connect = connect;

}).call(this);

//# sourceMappingURL=elasticsearch.js.map