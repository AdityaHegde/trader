const Decorators = require("../../Decorators");
const BaseModel = require("../BaseModel");

@Decorators.resource("price")
@Decorators.resource_path("/v2/prices")
class Price extends BaseModel {
  @Decorators.number()
  amount;

  @Decorators.string()
  currency;

  updateData(priceData) {
    this.amount = Number(priceData.amount);
    this.currency = priceData.currency;

    return super.updateData(priceData);
  }

  static getBuyPrice(account, paymentMethod) {
    return this.get(`${account.currency}-${paymentMethod.currency}/buy`);
  }

  static getSellPrice(account, paymentMethod) {
    return this.get(`${account.currency}-${paymentMethod.currency}/sell`);
  }

  static getSpotPrice(account, paymentMethod) {
    return this.get(`${account.currency}-${paymentMethod.currency}/spot`);
  }
}

module.exports = Price;
