const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const Buy = require("./Buy");

@CoinbaseResource.resource("sell")
@CoinbaseResource.resource_path("sells")
@MongooseDecorators.model("CoinbaseSell")
class Sell extends Buy {
}

module.exports = Sell;
