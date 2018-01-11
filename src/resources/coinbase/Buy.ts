const Decorators = require("../../Decorators");
const Deposit = require("./Deposit");

@Decorators.resource("buy")
@Decorators.resource_path("buys")
@Decorators.model("CoinbaseBuy")
class Buy extends Deposit {
  @Decorators.number()
  total;

  @Decorators.string()
  instant;

  updateData(buyData) {
    this.total = Number(buyData.total.amount);
    this.instant = buyData.instant;

    return super.updateData(buyData);
  }
}

module.exports = Buy;
