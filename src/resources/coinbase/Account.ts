const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const Address = require("./Address");
const Buy = require("./Buy");
const Sell = require("./Sell");
const Deposit = require("./Deposit");
const Withdraw = require("./Withdraw");
const Transaction = require("./Transaction");

@CoinbaseResource.resource("account")
@CoinbaseResource.resource_path("/v2/accounts")
@MongooseDecorators.model("CoinbaseAccount")
class Account extends CoinbaseResource {
  @MongooseDecorators.string()
  name;

  @MongooseDecorators.boolean()
  primary;

  @MongooseDecorators.string()
  type;

  @MongooseDecorators.string()
  currency;

  @MongooseDecorators.number()
  balance;

  updateData(accountData) {
    this.name = accountData.name;
    this.primary = accountData.primary;
    this.type = accountData.type;
    this.currency = accountData.currency.code;
    this.balance = Number(accountData.balance.amount);

    return super.updateData(accountData);
  }

  addresses() {
    return Address.getAll(this);
  }

  buys() {
    return Buy.getAll(this);
  }

  buy(amount, paymentMethod, commit = true) {
    return Buy.create({
      amount,
      currency: this.currency,
      payment_method: paymentMethod.id,
      commit
    }, this);
  }

  buyWith(total, paymentMethod, commit = true) {
    return Buy.create({
      total,
      currency: paymentMethod.currency,
      payment_method: paymentMethod.id,
      commit
    }, this);
  }

  sells() {
    return Sell.getAll(this);
  }

  sell(amount, paymentMethod, commit = true) {
    return Sell.create({
      amount,
      currency: this.currency,
      payment_method: paymentMethod.id,
      commit
    }, this);
  }

  deposits() {
    return Deposit.getAll(this);
  }

  deposit(amout, paymentMethod, commit = true) {
    return Deposit.create({
      amout,
      currency: this.currency,
      payment_method: paymentMethod.id,
      commit
    }, this);
  }

  withdraws() {
    return Withdraw.getAll(this);
  }

  withdraw(amout, paymentMethod, commit = true) {
    return Withdraw.create({
      amout,
      currency: this.currency,
      payment_method: paymentMethod.id,
      commit
    }, this);
  }

  transactions() {
    return Transaction.getAll(this);
  }

  sendMoney(amount, to) {
    return Transaction.create({
      type: "send",
      to: to.address,
      amount,
      currency: this.currency,
      skip_notifications: true
    }, this);
  }
}

module.exports = Account;
