const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const Transaction = require("./Transaction");

@CoinbaseResource.resource("address")
@CoinbaseResource.resource_path("addresses")
@MongooseDecorators.model("CoinbaseAddress")
class Address extends CoinbaseResource {
  @MongooseDecorators.string()
  address;

  @MongooseDecorators.string()
  name;

  @MongooseDecorators.string()
  network;

  updateData(addressData) {
    this.address = addressData.address;
    this.name = addressData.name;
    this.network = addressData.network;

    return super.updateData(addressData);
  }

  get transactions() {
    return Transaction.getAll(this);
  }
}

module.exports = Address;
