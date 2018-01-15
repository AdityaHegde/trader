const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const Deposit = require("./Deposit");

@CoinbaseResource.resource("withdraw")
@CoinbaseResource.resource_path("/v2/withdraws")
@MongooseDecorators.model("CoinbaseWithdraw")
class Withdraw extends Deposit {
}

module.exports = Withdraw;
