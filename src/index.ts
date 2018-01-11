const CoinbaseResources = require("./resources/coinbase");
const SimpleProfitTarget = require("./algorithms/SimpleProfitTarget");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/prod");
mongoose.Promise = Promise;

const Helpers = require("./Helpers");

let usdPayment;
let usdAccount;
let btcAccount;
let bchAccount;

let btcAlgo;
let bchAlgo;

async function init() {
  await CoinbaseResources.init();

  let paymentMethods = await CoinbaseResources.PaymentMethod.getAll();
  usdPayment = _.find(paymentMethods, {
    __data: {
      type: "fiat_account",
      // TODO why is usd wallet not allowed to buy from
      //      Might be false when account is empty
      // allow_buy: true,
      allow_sell: true,
      instant_buy: true,
      instant_sell: true
    }
  });

  let accounts = await CoinbaseResources.Account.getAll();
  usdAccount = _.find(accounts, {
    __data: {
      type: "fiat",
      currency: "USD"
    }
  });
  btcAccount = _.find(accounts, {
    __data: {
      type: "wallet",
      currency: "BTC"
    }
  });
  bchAccount = _.find(accounts, {
    __data: {
      type: "wallet",
      currency: "BCH"
    }
  });

  btcAlgo = await SimpleProfitTarget.new({
    maxBuyPercentage: 10,
    minBuyPercentage: 0,
    buyPercentageDecrementAmout: 2,
    buyPercentageDecrementInterval: 24 * 60,
    buyHardThreshold: 14000,
    spendAmout: 1250,

    maxProfit: 20,
    minProfit: 16,
    profitDecrementAmout: 2,
    profitDecrementInterval: 24 * 60,

    account: btcAccount,
    paymentMethod: usdPayment,
    paymentAccount: usdAccount,
  });
  bchAlgo = await SimpleProfitTarget.new({
    maxBuyPercentage: 10,
    minBuyPercentage: 0,
    buyPercentageDecrementAmout: 2,
    buyPercentageDecrementInterval: 24 * 60,
    buyHardThreshold: 2400,
    spendAmout: 1250,

    maxProfit: 20,
    minProfit: 14,
    profitDecrementAmout: 2,
    profitDecrementInterval: 24 * 60,

    account: bchAccount,
    paymentMethod: usdPayment,
    paymentAccount: usdAccount,
  });
}

async function iteration() {
  btcAlgo.run();
  bchAlgo.run();
}

async function run() {
  await init();

  setInterval(iteration, 1000);

  // mongoose.disconnect();
}

run().then(() => {
}, (err) => {
  console.log(err);
  mongoose.disconnect();
});
