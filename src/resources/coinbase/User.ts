const Decorators = require("../../Decorators");
const BaseModel = require("../BaseModel");

@Decorators.resource("user")
@Decorators.resource_path("/v2/user")
@Decorators.model("CoinbaseUser")
class User extends BaseModel {
  @Decorators.string()
  name;

  @Decorators.string()
  username;

  @Decorators.string()
  profile_location;

  @Decorators.string()
  profile_bio;

  @Decorators.string()
  profile_url;

  @Decorators.string()
  avatar_url;

  @Decorators.string()
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
