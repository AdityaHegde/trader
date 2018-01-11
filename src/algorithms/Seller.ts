const Decorators = require("../Decorators");
const Base = require("../Base");
const CoinbaseResources = require("../resources/coinbase");

@Decorators.model("Seller")
class Seller extends Base {
  @Decorators.number()
  maxProfit;

  @Decorators.number()
  minProfit;

  @Decorators.number()
  profitDecrementAmout;

  @Decorators.number()
  profitDecrementInterval;

  @Decorators.objectId()
  account;

  @Decorators.objectId()
  paymentMethod;


  updateData(sellerData) {
    this.id = "seller_" + sellerData.account.id + "_" + sellerData.paymentMethod.id;
    this.maxProfit = sellerData.maxProfit;
    this.minProfit = sellerData.minProfit;
    this.profitDecrementAmout = sellerData.profitDecrementAmout;
    this.profitDecrementInterval = sellerData.profitDecrementInterval;
    this.resetSell();

    this.account = sellerData.account;
    this.paymentMethod = sellerData.paymentMethod;

    return super.updateData(sellerData);
  }

  async run(lastBuy) {
    let sellPrice = await CoinbaseResources.Price.getSellPrice(this.account, this.paymentMethod);
    let profit = lastBuy.native_amount * (1 + this.profit / 100);

    // console.log(sellPrice.amount, lastBuy.native_amount, profit, this.profit, new Date().getTime());

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

  async sell() {
    let sellOrder = await this.account.sell(
      this.account.balance,
      this.paymentMethod,
      false
    );

    await sellOrder.commit();
    this.resetSell();
  }

  resetSell() {
    this.profit = this.maxProfit;
    this.lastProfitDecrement = 0;
  }
}

module.exports = Seller;
