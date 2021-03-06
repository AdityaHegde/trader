const Base = require("../Base");
const MongooseDecorators = require("../decorators/Mongoose");
const request = require("request-promise-native");
const _ = require("lodash");

@MongooseDecorators.model("Api")
class Api extends Base {
  @MongooseDecorators.string()
  apiBase;

  updateData(apiOptions) {
    this.apiBase = apiOptions.apiBase;
    this.id = "api_" + this.apiBase;

    return super.updateData(apiOptions);
  }

  async sendRequest(path, method, body, headers) {
    if (typeof body !== "string") {
      body = JSON.stringify(body);
    }

    let options = {
      url: path,
      baseUrl: this.apiBase,
      method,
      headers: _.merge({
        "Content-Type": "application/json"
      }, (headers || {}))
    };

    if (body) {
      options.body = body;
    }

    let response = await request(options);
    // console.log(options, response);

    return JSON.parse(response);
  }
}

module.exports = Api;
