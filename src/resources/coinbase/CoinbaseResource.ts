const Decorators = require("../../Decorators");
const BaseModel = require("../BaseModel");

class CoinbaseResource extends BaseModel {
  @Decorators.date()
  created_at;

  @Decorators.date()
  updated_at;

  @Decorators.string()
  resource_path;

  updateData(data) {
    this.id = data.id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.resource_path = data.resource_path;

    return super.updateData(data);
  }
}

module.exports = CoinbaseResource;
