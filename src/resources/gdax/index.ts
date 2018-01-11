const glob = require("glob");
// will be compiled to .js
const resources = glob.sync(__dirname + "/*.js").map(require);

const GDAXApi = require("../../apis/CoinbaseApi");

let GDAXResources = {
  async init() {
    let gdaxApi = await CoinbaseApi.new({
      apiBase: "https://api.gdax.com/",
      apiVersion: "2017-08-07",
      secret: Buffer("GDAX_API_SECRET", "base64"),
      key: "GDAX_API_KEY",
      passphrase: "GDAX_API_PASSPHRASE",
      signatureDigest: "base64"
    });
    resources.forEach((resource) => {
      // to avoid self
      if (resource) {
        resource.api = coinbaseApi;
      }
    });
  }
};

resources.forEach((resource) => {
  // to avoid self
  if (resource) {
    GDAXResources[resource.name] = resource;
  }
});

module.exports = GDAXResources;
