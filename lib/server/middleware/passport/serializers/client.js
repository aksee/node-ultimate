exports.serializeClient = function(_app)
{
  return function (app, callback) {
    return callback(null, app);
  };
}
exports.deserializeClient = function(_app)
{
  return function (app, callback) {
    App.findOne({_id: app._id}, function (err, app) {
      if (err) {
        return callback(err);
      }
      return callback(null, app);
    });
  };

}
