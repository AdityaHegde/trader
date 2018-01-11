const Decorators = require("../../Decorators");
const Deposit = require("./Deposit");

@Decorators.resource("withdraw")
@Decorators.resource_path("/v2/withdraws")
@Decorators.model("CoinbaseWithdraw")
class Withdraw extends Deposit {
}

module.exports = Withdraw;
