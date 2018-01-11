const mongoose = require("mongoose");
const Types = mongoose.Schema.Types;
const _ = require("lodash");

class Decorators {
  static model(modelName) {
    return function(classObject) {
      if (!classObject.prototype.hasOwnProperty("__schema")) {
        classObject.prototype.__schema = _.cloneDeep(classObject.prototype.__schema || {});
      }
      classObject.prototype.__schema = classObject.prototype.__schema || {};
      classObject.__mongooseModel = classObject.prototype.__mongooseModel = mongoose.model(modelName, mongoose.Schema(classObject.prototype.__schema));
    }
  }

  static string(fieldType = String, transform = function (value) { return value }) {
    return function(classPrototype, fieldName, descriptor) {
      if (!classPrototype.hasOwnProperty("__schema")) {
        classPrototype.__schema = _.cloneDeep(classPrototype.__schema || {});
      }
      classPrototype.__schema[fieldName] = fieldType;

      if (descriptor) {
        descriptor.set = function (newValue) {
          this.__data[fieldName] = transform(newValue);
          this.__cache[fieldName] = newValue;
        };
        descriptor.get = function () {
          return this.__cache[fieldName];
        };
      } else {
        Object.defineProperty(classPrototype, fieldName, {
          configurable: false,
          get() {
            return this.__cache[fieldName];
          },
          set(newValue) {
            this.__data[fieldName] = transform(newValue);
            this.__cache[fieldName] = newValue;
          }
        });
      }
    }
  }

  static number() {
    return this.string(Number);
  }

  static boolean() {
    return this.string(Boolean);
  }

  static date() {
    // return this.string(Date);
    return this.string();
  }

  static objectId() {
    return this.string(Types.ObjectId, function (value) {
      return value.__mongooseInstance && value.__mongooseInstance._id;
    });
  }

  static mixed() {
    return this.string(Types.Mixed);
  }

  static resource(resourceName) {
    return function(classObject) {
      classObject.resource = resourceName;
    }
  }

  static resource_path(resourcePathName) {
    return function(classObject) {
      classObject.resource_path = resourcePathName;
    }
  }
}

module.exports = Decorators;
