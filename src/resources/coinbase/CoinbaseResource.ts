const MongooseDecorators = require("../../decorators/Mongoose");
const BaseModel = require("../BaseModel");

class CoinbaseResource extends BaseModel {
  @MongooseDecorators.date()
  created_at;

  @MongooseDecorators.date()
  updated_at;

  @MongooseDecorators.string()
  resource_path;

  updateData(data) {
    this.id = data.id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.resource_path = data.resource_path;

    return super.updateData(data);
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

module.exports = CoinbaseResource;
