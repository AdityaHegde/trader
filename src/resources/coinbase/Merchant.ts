const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const BaseModel = require("../BaseModel");

@CoinbaseResource.resource("merchant")
@CoinbaseResource.resource_path("/v2/merchants")
@MongooseDecorators.model("CoinbaseMerchant")
class Merchant extends BaseModel {
  @MongooseDecorators.string()
  name;

  @MongooseDecorators.string()
  address;

  @MongooseDecorators.string()
  website_url;

  @MongooseDecorators.string()
  avatar_url;

  @MongooseDecorators.string()
  logo_url;

  @MongooseDecorators.string()
  cover_image_url;

  @MongooseDecorators.string()
  resource_path;

  updateData(merchantData) {
    this.id = merchantData.id;
    this.name = merchantData.name;
    this.address = merchantData.address;

    this.website_url = merchantData.website_url;
    this.avatar_url = merchantData.avatar_url;
    this.logo_url = merchantData.logo_url;
    this.cover_image_url = merchantData.cover_image_url;

    this.resource_path = merchantData.resource_path;

    return super.updateData(merchantData);
  }
}

module.exports = Merchant;
