const MongooseDecorators = require("../decorators/Mongoose");
const Base = require("../Base");
const CoinbaseResources = require("../resources/coinbase");

@MongooseDecorators.model("Buyer")
class Buyer extends Base {
  @MongooseDecorators.number()
  maxBuyPercentage;

  @MongooseDecorators.number()
  minBuyPercentage;

  @MongooseDecorators.number()
  buyPercentageDecrementAmout;

  @MongooseDecorators.number()
  buyPercentageDecrementInterval;

  @MongooseDecorators.number()
  buyHardThreshold;

  @MongooseDecorators.number()
  spendAmout;

  @MongooseDecorators.objectId()
  account;

  @MongooseDecorators.objectId()
  paymentMethod;

  @MongooseDecorators.objectId()
  paymentAccount;

  updateData(buyerData) {
    this.id = "buyer_" + buyerData.account.id + "_" + buyerData.paymentMethod.id;
    this.maxBuyPercentage = buyerData.maxBuyPercentage;
    this.minBuyPercentage = buyerData.minBuyPercentage;
    this.buyPercentageDecrementAmout = buyerData.buyPercentageDecrementAmout;
    this.buyPercentageDecrementInterval = buyerData.buyPercentageDecrementInterval;
    // hard threshold to stop buy amount. present because 1st buy was at a high price
    this.buyHardThreshold = buyerData.buyHardThreshold;
    // -1 == spend everything in usdAccount
    this.spendAmout = buyerData.spendAmout || -1;
    this.resetBuy();

    this.account = buyerData.account;
    this.paymentMethod = buyerData.paymentMethod;
    this.paymentAccount = buyerData.paymentAccount;

    return super.updateData(buyerData);
  }

  async run() {
    let buyPrice = await CoinbaseResources.Price.getBuyPrice(this.account, this.paymentMethod);
    let buyPriceThreshold = this.buyHardThreshold * (1 - this.buyPercentage / 100);

    console.log(`Looking to buy ${this.account.currency} currently at ${buyPrice.amount} for ${buyPriceThreshold}`);

    if (buyPrice.amount <= buyPriceThreshold) {
      return true;
    } else {
      let curTime = new Date().getTime();
      let timeDiff = curTime - this.lastBuyDecrement;

      if (timeDiff >= this.buyPercentageDecrementInterval &&
          this.buyPercentage - this.buyPercentageDecrementAmout >= this.minBuyPercentage) {
        this.buyPercentage -= this.buyPercentageDecrementAmout;
        this.lastBuyDecrement = curTime;
      }

      return false;
    }
  }

  getSpendAmount() {
    let spendAmout = this.spendAmout === -1 ? this.paymentAccount.balance : this.spendAmout;
    if (this.paymentMethod.buy_limit && this.paymentMethod.buy_limit.remaining < spendAmout) {
      // spendAmout = this.paymentMethod.buy_limit.remaining;
      return -1;
    }
    return spendAmout;
  }

  async buy() {
    let spendAmout = this.getSpendAmount();
    if (spendAmout > 0) {
      console.log(`Buying ${this.account.currency} at ${spendAmout}`);
      let buyOrder = await this.account.buyWith(
        this.getSpendAmount(),
        this.paymentMethod,
        false
      );

      await buyOrder.commit();
      await this.paymentMethod.update();
      await this.paymentAccount.update();
      this.resetBuy();
    }
  }

  resetBuy() {
    this.buyPercentage = this.maxBuyPercentage;
    this.lastBuyDecrement = 0;
  }

  async updateAccounts() {
    await this.account.update();
  }
}

module.exports = Buyer;
