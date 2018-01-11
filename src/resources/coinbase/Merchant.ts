const Decorators = require("../../Decorators");
const BaseModel = require("../BaseModel");

@Decorators.resource("merchant")
@Decorators.resource_path("/v2/merchants")
@Decorators.model("CoinbaseMerchant")
class Merchant extends BaseModel {
  @Decorators.string()
  name;

  @Decorators.string()
  address;

  @Decorators.string()
  website_url;

  @Decorators.string()
  avatar_url;

  @Decorators.string()
  logo_url;

  @Decorators.string()
  cover_image_url;

  @Decorators.string()
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
