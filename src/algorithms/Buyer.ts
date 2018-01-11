const Decorators = require("../Decorators");
const Base = require("../Base");
const CoinbaseResources = require("../resources/coinbase");

@Decorators.model("Buyer")
class Buyer extends Base {
  @Decorators.number()
  maxBuyPercentage;

  @Decorators.number()
  minBuyPercentage;

  @Decorators.number()
  buyPercentageDecrementAmout;

  @Decorators.number()
  buyPercentageDecrementInterval;

  @Decorators.number()
  buyHardThreshold;

  @Decorators.number()
  spendAmout;

  @Decorators.objectId()
  account;

  @Decorators.objectId()
  paymentMethod;

  @Decorators.objectId()
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
    if (this.paymentMethod.buy_limit.remaining < spendAmout) {
      spendAmout = this.paymentMethod.buy_limit.remaining;
    }
    return spendAmout;
  }

  async buy() {
    let buyOrder = await this.account.buyWith(
      this.getSpendAmount(),
      this.paymentMethod,
      false
    );

    await buyOrder.commit();
    this.resetBuy();
  }

  resetBuy() {
    this.buyPercentage = this.maxBuyPercentage;
    this.lastBuyDecrement = 0;
  }
}

module.exports = Buyer;
