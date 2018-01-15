const MongooseDecorators = require("../../decorators/Mongoose");
const Deposit = require("./Deposit");
const CoinbaseResource = require("./CoinbaseResource");

@CoinbaseResource.resource("buy")
@CoinbaseResource.resource_path("buys")
@MongooseDecorators.model("CoinbaseBuy")
class Buy extends Deposit {
  @MongooseDecorators.number()
  total;

  @MongooseDecorators.string()
  instant;

  updateData(buyData) {
    this.total = Number(buyData.total.amount);
    this.instant = buyData.instant;

    return super.updateData(buyData);
  }
}

module.exports = Buy;
