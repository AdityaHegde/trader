const Decorators = require("../../Decorators");
const CoinbaseResource = require("./CoinbaseResource");

@Decorators.resource("transaction")
@Decorators.resource_path("transactions")
@Decorators.model("CoinbaseTransaction")
class Transaction extends CoinbaseResource {
  @Decorators.string()
  type;

  @Decorators.string()
  status;

  @Decorators.number()
  amount;

  @Decorators.number()
  native_amount;

  // @Decorators.string()
  // description;

  @Decorators.boolean()
  instant_exchange;

  // @Decorators.string()
  // details;

  @Decorators.string()
  network;

  @Decorators.string()
  to;

  @Decorators.string()
  from;

  @Decorators.string()
  buy;

  @Decorators.string()
  sell;

  @Decorators.string()
  address;

  @Decorators.string()
  application;


  updateData(transactionData) {
    this.type = transactionData.type;
    this.status = transactionData.status;
    this.amount = Number(transactionData.amount.amount);
    this.native_amount = Number(transactionData.native_amount.amount);
    // this.description = transactionData.description;
    this.instant_exchange = transactionData.instant_exchange;
    // this.details = transactionData.details;
    this.network = transactionData.network;

    this.to = transactionData.to && transactionData.to.id;
    this.from = transactionData.from && transactionData.from.id;
    this.buy = transactionData.buy && transactionData.buy.id;
    this.sell = transactionData.sell && transactionData.sell.id;

    this.address = transactionData.address;
    this.application = transactionData.application;

    return super.updateData(transactionData);
  }
}

module.exports = Transaction;
