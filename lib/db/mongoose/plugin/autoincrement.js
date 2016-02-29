/**
 * Auto increment support for mongodb and mongoose
 * Created by Alexey Chistyakov <ross@newmail.ru> on 11.10.2014.
 */

var settings = {};
var defaultSettings = {
  collection: "counters",
  field: "_id",
  step: 1
};

var mongoose = require("mongoose");

var CounterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0}
});
var counters = mongoose.model('counters', CounterSchema);


var get_new_id = function (name, cb) {
  counters.findByIdAndUpdate({_id: name}, {$inc: {seq: 1}}, function (error, counter) {
    if (error)
      return cb(error);
    else {
      if (counter == null) {
        var new_counter = new counters();
        new_counter._id = name;
        new_counter.save(function (counter_insert_err, counter_result) {
          if (counter_insert_err) {
            return cb(counter_insert_err);
          }
          //return cb(null, counter_result.seq);
          return get_new_id(name, cb);
        })
      } else {

        return cb(null, counter.seq + 1);
      }
    }
  });
};


module.exports = function (schema, options) {
  options = options || {};
  var fieldName = options.field || defaultSettings.field;

  if (schema.options._id) {
    var schemaField = {};
    schemaField[fieldName] = {type: Number, unique: true, require: true,index:true};
    schema.add(schemaField);
  }


  schema.pre('save', function (next) {
    var doc = this;
    if (this.isNew) {
      get_new_id(doc.collection.name, function (err, new_id) {
        if (err) {
          next(err);
        } else {
          doc._id = new_id;
          next();
        }

      })
    } else {
      next();
    }
  });
};
