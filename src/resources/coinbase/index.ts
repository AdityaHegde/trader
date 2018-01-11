const glob = require("glob");
// will be compiled to .js
const resources = glob.sync(__dirname + "/*.js").map(require);

const CoinbaseApi = require("../../apis/CoinbaseApi");

let CoinbaseResources = {
  async init() {
    let coinbaseApi = await CoinbaseApi.new({
      apiBase: "https://api.coinbase.com/",
      apiVersion: "2017-08-07",
      signatureDigest: "hex"
    });
    await coinbaseApi.updateRecord();

    CoinbaseResources.__api = coinbaseApi;

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
    CoinbaseResources[resource.name] = resource;
  }
});

module.exports = CoinbaseResources;
