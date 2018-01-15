const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");

@CoinbaseResource.resource("transaction")
@CoinbaseResource.resource_path("transactions")
@MongooseDecorators.model("CoinbaseTransaction")
class Transaction extends CoinbaseResource {
  @MongooseDecorators.string()
  type;

  @MongooseDecorators.string()
  status;

  @MongooseDecorators.number()
  amount;

  @MongooseDecorators.number()
  native_amount;

  // @MongooseDecorators.string()
  // description;

  @MongooseDecorators.boolean()
  instant_exchange;

  // @MongooseDecorators.string()
  // details;

  @MongooseDecorators.string()
  network;

  @MongooseDecorators.string()
  to;

  @MongooseDecorators.string()
  from;

  @MongooseDecorators.string()
  buy;

  @MongooseDecorators.string()
  sell;

  @MongooseDecorators.string()
  address;

  @MongooseDecorators.string()
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
