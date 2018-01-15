const MongooseDecorators = require("../decorators/Mongoose");
const Algorithm = require("./Algorithm");
const CoinbaseResources = require("../resources/coinbase");
const Buyer = require("./Buyer");
const Seller = require("./Seller");
const _ = require("lodash");

@MongooseDecorators.model("SimpleProfitTarget")
class SimpleProfitTarget extends Algorithm {
  @MongooseDecorators.objectId()
  buyer;

  @MongooseDecorators.objectId()
  seller;

  pendingLastTransaction = false;

  async updateData(simpleProfitTargetData) {
    this.buyer = await Buyer.new(simpleProfitTargetData);
    this.seller = await Seller.new(simpleProfitTargetData);
    this.id = this.buyer.id + "_" + this.seller.id;

    return super.updateData(simpleProfitTargetData);
  }

  async run() {
    try {
      let transactions = await this.buyer.account.transactions();
      let lastBuy = _.find(transactions, {
        type: "buy",
        status: "completed",
      });
      let lastTransaction = transactions[0];

      // wait for previous transaction to complete
      if (!lastTransaction || lastTransaction.status === "completed") {
        if (this.pendingLastTransaction) {
          await this.buyer.updateAccounts();
          this.pendingLastTransaction = true;
        }

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
      } else if (lastTransaction && lastTransaction.status === "pending") {
        this.pendingLastTransaction = true;
      }
    } catch(err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = SimpleProfitTarget;
