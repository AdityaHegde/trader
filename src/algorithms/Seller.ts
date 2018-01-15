const MongooseDecorators = require("../decorators/Mongoose");
const Base = require("../Base");
const CoinbaseResources = require("../resources/coinbase");

@MongooseDecorators.model("Seller")
class Seller extends Base {
  @MongooseDecorators.number()
  maxProfit;

  @MongooseDecorators.number()
  minProfit;

  @MongooseDecorators.number()
  profitDecrementAmout;

  @MongooseDecorators.number()
  profitDecrementInterval;

  @MongooseDecorators.objectId()
  account;

  @MongooseDecorators.objectId()
  paymentMethod;

  @MongooseDecorators.objectId()
  paymentAccount;

  updateData(sellerData) {
    this.id = "seller_" + sellerData.account.id + "_" + sellerData.paymentMethod.id;
    this.maxProfit = sellerData.maxProfit;
    this.minProfit = sellerData.minProfit;
    this.profitDecrementAmout = sellerData.profitDecrementAmout;
    this.profitDecrementInterval = sellerData.profitDecrementInterval;
    this.resetSell();

    this.account = sellerData.account;
    this.paymentMethod = sellerData.paymentMethod;
    this.paymentAccount = sellerData.paymentAccount;

    return super.updateData(sellerData);
  }

  async run(lastBuyTransaction) {
    let sellPrice = await CoinbaseResources.Price.getSellPrice(this.account, this.paymentMethod);
    let lastCurrencyPrice = lastBuyTransaction.native_amount / lastBuyTransaction.amount;
    let profit = lastCurrencyPrice * (1 + this.profit / 100);

    console.log(`Looking to sell ${this.account.currency} currently at ${sellPrice.amount} for ${profit}`);

    if (sellPrice.amount >= profit) {
      return true;
    } else {
      let curTime = new Date().getTime();
      let timeDiff = curTime - this.lastProfitDecrement;

      if (timeDiff >= this.profitDecrementInterval &&
          this.profit - this.profitDecrementAmout >= this.minProfit) {
        this.profit -= this.profitDecrementAmout;
        this.lastProfitDecrement = curTime;
      }

      return false;
    }
  }

  getSellAmount() {
    let sellAmount = this.account.balance;
    if (this.paymentMethod.sell_limit && this.paymentMethod.sell_limit.remaining < sellAmount) {
      // sellAmount = this.paymentMethod.sell_limit.remaining;
      return -1;
    }
    return sellAmount;
  }

  async sell() {
    let sellAmount = this.getSellAmount();
    if (sellAmount > 0) {
      console.log(`Selling ${sellAmount} ${this.account.currency}`);
      let sellOrder = await this.account.sell(
        sellAmount,
        this.paymentMethod,
        false
      );

      await sellOrder.commit();
      await this.paymentMethod.updateRecord();
      await this.paymentAccount.updateRecord();
      this.resetSell();
    }
  }

  resetSell() {
    this.profit = this.maxProfit;
    this.lastProfitDecrement = 0;
  }
}

module.exports = Seller;
