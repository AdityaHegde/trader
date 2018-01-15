const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const BaseModel = require("../BaseModel");

@CoinbaseResource.resource("user")
@CoinbaseResource.resource_path("/v2/user")
@MongooseDecorators.model("CoinbaseUser")
class User extends BaseModel {
  @MongooseDecorators.string()
  name;

  @MongooseDecorators.string()
  username;

  @MongooseDecorators.string()
  profile_location;

  @MongooseDecorators.string()
  profile_bio;

  @MongooseDecorators.string()
  profile_url;

  @MongooseDecorators.string()
  avatar_url;

  @MongooseDecorators.string()
  resource_path;


  updateData(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.username = userData.username;
    this.profile_location = userData.profile_location;
    this.profile_bio = userData.profile_bio;
    this.profile_url = userData.profile_url;
    this.avatar_url = userData.avatar_url;
    this.resource_path = userData.resource_path;

    return super.updateData(userData);
  }
}

module.exports = User;
