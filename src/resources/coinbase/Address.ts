const Decorators = require("../../Decorators");
const CoinbaseResource = require("./CoinbaseResource");
const Transaction = require("./Transaction");

@Decorators.resource("address")
@Decorators.resource_path("addresses")
@Decorators.model("CoinbaseAddress")
class Address extends CoinbaseResource {
  @Decorators.string()
  address;

  @Decorators.string()
  name;

  @Decorators.string()
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
