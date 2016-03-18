exports.serializeClient = function(_app)
{
  return function (app, callback) {
    return callback(null, app);
  };
}
exports.deserializeClient = function(_app)
{
  return function (app, callback) {
    return callback(null, app);
  };
}
