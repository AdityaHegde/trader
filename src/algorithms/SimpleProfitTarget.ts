const Decorators = require("../Decorators");
const Algorithm = require("./Algorithm");
const CoinbaseResources = require("../resources/coinbase");
const Buyer = require("./Buyer");
const Seller = require("./Seller");
const _ = require("lodash");

@Decorators.model("SimpleProfitTarget")
class SimpleProfitTarget extends Algorithm {
  @Decorators.objectId()
  buyer;

  @Decorators.objectId()
  seller;


  async updateData(simpleProfitTargetData) {
    this.buyer = await Buyer.new(simpleProfitTargetData);
    this.seller = await Seller.new(simpleProfitTargetData);
    this.id = this.buyer.id + "_" + this.seller.id;

    return super.updateData(simpleProfitTargetData);
  }

  async run() {
    let transactions = await this.buyer.account.transactions();
    let lastBuy = _.find(transactions, {
      type: "buy",
      status: "completed",
    });
    let lastTransaction = transactions[0];
    // console.log(lastTransaction && lastTransaction.status, lastTransaction && lastTransaction.type);

    // wait for previous transaction to complete
    if (!lastTransaction || lastTransaction.status === "completed") {
      if (!lastTransaction || lastTransaction.type === "sell") {
        // just sold, buy more
        if (await this.buyer.run()) {
          await this.buyer.buy();
        }
      } else {
        // just bought, sell them
        if (await this.seller.run(lastBuy)) {
          await this.seller.sell();
        }
      }
    }
  }
}

module.exports = SimpleProfitTarget;
