const Decorators = require("../../Decorators");
const CoinbaseResource = require("./CoinbaseResource");

@Decorators.resource("deposit")
@Decorators.resource_path("deposits")
@Decorators.model("CoinbaseDeposit")
class Deposit extends CoinbaseResource {
  @Decorators.string()
  status;

  @Decorators.string()
  payment_method;

  @Decorators.string()
  transaction;

  @Decorators.number()
  amount;

  @Decorators.number()
  subtotal;

  @Decorators.number()
  fee;

  @Decorators.boolean()
  committed;

  @Decorators.date()
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
