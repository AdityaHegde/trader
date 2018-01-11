const Decorators = require("../../Decorators");
const Buy = require("./Buy");

@Decorators.resource("sell")
@Decorators.resource_path("sells")
@Decorators.model("CoinbaseSell")
class Sell extends Buy {
}

module.exports = Sell;
