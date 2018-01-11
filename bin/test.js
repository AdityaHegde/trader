const Merchant = require("../src/models/Merchant");

async function init() {
  console.log(await Merchant.getAll());
}

try {
  init();
} catch(err) {
  console.log(err);
}
