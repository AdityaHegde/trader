const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");

@CoinbaseResource.resource("deposit")
@CoinbaseResource.resource_path("deposits")
@MongooseDecorators.model("CoinbaseDeposit")
class Deposit extends CoinbaseResource {
  @MongooseDecorators.string()
  status;

  @MongooseDecorators.string()
  payment_method;

  @MongooseDecorators.string()
  transaction;

  @MongooseDecorators.number()
  amount;

  @MongooseDecorators.number()
  subtotal;

  @MongooseDecorators.number()
  fee;

  @MongooseDecorators.boolean()
  committed;

  @MongooseDecorators.date()
  payout_at;

  updateData(depositData) {
    this.status = depositData.status;
    this.payment_method = depositData.payment_method.id;
    this.transaction = depositData.transaction.id;
    this.amount = Number(depositData.amount.amount);
    this.subtotal = Number(depositData.subtotal.amount);
    this.fee = Number(depositData.fee.amount);

    this.committed = depositData.committed;
    this.payout_at = depositData.payout_at;

    return super.updateData(depositData);
  }

  commit() {
    if (!this.committed) {
      return super.commit();
    }
    return null;
  }
}

module.exports = Deposit;
