const MongooseDecorators = require("../decorators/Mongoose");
const Api = require("./Api");
const crypto = require("crypto");

@MongooseDecorators.model("CoinbaseApi")
class CoinbaseApi extends Api {
  @MongooseDecorators.string()
  apiVersion;

  @MongooseDecorators.string()
  key;

  @MongooseDecorators.string()
  secret;

  @MongooseDecorators.string()
  passphrase;

  @MongooseDecorators.string()
  signatureDigest;

  updateData(coinbaseApiData) {
    this.apiVersion = coinbaseApiData.apiVersion;
    this.key = coinbaseApiData.key;
    this.secret = coinbaseApiData.secret;
    this.passphrase = coinbaseApiData.passphrase;
    this.signatureDigest = coinbaseApiData.signatureDigest;

    return super.updateData(coinbaseApiData);
  }

  sendRequest(path, method, body) {
    if (body && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    let timestamp = Math.floor(Date.now() / 1000);
    let message = timestamp + method.toUpperCase() + path + (body ? body : "");
    let signature = crypto.createHmac("sha256", this.secret).update(message).digest(this.signatureDigest);
    let headers = {
      "CB-VERSION": this.apiVersion,
      "CB-ACCESS-KEY": this.key,
      "CB-ACCESS-SIGN": signature,
      "CB-ACCESS-TIMESTAMP": timestamp
    };

    if (this.passphrase) {
      headers["CB-ACCESS-PASSPHRASE"] = this.passphrase;
    }

    return super.sendRequest(path, method, body, headers);
  }
}

module.exports = CoinbaseApi;
