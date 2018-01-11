const sinon = require("sinon");
const should = require("should");
const mockery = require("mockery");
const mongoose = require("mongoose");
const _ = require("lodash");
const Helpers = require("../../dist/Helpers");
const TestUtils = require("../TestUtils");
const RequestMock = require("../RequestMock");

describe("Simple Sell and Buy tests", () => {
  let sandbox;
  let requestMock;

  let SimpleProfitTarget;
  let CoinbaseResources;

  let alog;
  let account;
  let paymentMethod;
  let paymentAccount;

  let buyer_run_spy;
  let buyer_buy_spy;
  let seller_run_spy;
  let seller_sell_spy;

  before(async () => {
    sandbox = sinon.sandbox.create({
      useFakeTimers: true
    });
    requestMock = new RequestMock(sandbox);

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false
    });
    mockery.registerMock("request-promise-native", requestMock.stub);

    // connect to test database
    await mongoose.connect("mongodb://localhost/test");
    mongoose.Promise = Promise;

    SimpleProfitTarget = require("../../dist/algorithms/SimpleProfitTarget");
    CoinbaseResources = require("../../dist/resources/coinbase");

    // update secret and key.
    await CoinbaseResources.init();
    CoinbaseResources.__api.secret = "api-secret";
    CoinbaseResources.__api.key = "api-key";
    await CoinbaseResources.__api.updateRecord();

    // create the test BTC account
    account = await CoinbaseResources.Account.new(require("../data/btc-account.json"));

    // create the test USD payment method
    paymentMethod = await CoinbaseResources.PaymentMethod.new(require("../data/usd-payment.json"));

    // create the test USD account
    paymentAccount = await CoinbaseResources.Account.new(require("../data/usd-account.json"));

    // create the alog
    algo = await SimpleProfitTarget.new({
      maxBuyPercentage: 20,
      minBuyPercentage: 0,
      buyPercentageDecrementAmout: 2,
      buyPercentageDecrementInterval: 2000,
      buyHardThreshold: 1400,
      spendAmout: 1000,

      maxProfit: 50,
      minProfit: 10,
      profitDecrementAmout: 2,
      profitDecrementInterval: 2000,

      account: account,
      paymentMethod: paymentMethod,
      paymentAccount: paymentAccount,
    });

    buyer_run_spy = sandbox.spy(algo.buyer, "run");
    buyer_buy_spy = sandbox.spy(algo.buyer, "buy");
    seller_run_spy = sandbox.spy(algo.seller, "run");
    seller_sell_spy = sandbox.spy(algo.seller, "sell");
  });

  beforeEach(async () => {
    await CoinbaseResources.Transaction.remove({});
    await CoinbaseResources.Buy.remove({});
    await CoinbaseResources.Sell.remove({});
    sandbox.resetBehavior();
    sandbox.resetHistory();
  });

  describe("No previous transaction", async () => {
    before(() => {
      sandbox.clock.setSystemTime(0);
    });

    beforeEach(async () => {
      requestMock.mockPrice("BTC-USD", "buy", 1300);
      requestMock.mockPrice("BTC-USD", "sell", 1350);
      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: []
      });
      requestMock.mockPath("/v2/accounts/test-account/buys", {
        data: require("../data/btc-buy.json")
      });
      requestMock.mockPath("/v2/accounts/test-account/buys/test-buy/commit", {
        data: require("../data/btc-buy.json")
      });
    });

    it("1st run", async () => {
      sandbox.clock.tick(1000);
      await algo.run();

      sinon.assert.calledOnce(buyer_run_spy);
      sinon.assert.notCalled(buyer_buy_spy);
      (algo.buyer.buyPercentage).should.be.equal(20);
      sinon.assert.notCalled(seller_run_spy);
      sinon.assert.notCalled(seller_sell_spy);
      (algo.seller.profit).should.be.equal(50);
    });

    it("2nd run", async () => {
      sandbox.clock.tick(1000);
      await algo.run();

      sinon.assert.calledOnce(buyer_run_spy);
      sinon.assert.notCalled(buyer_buy_spy);
      (algo.buyer.buyPercentage).should.be.equal(18);
      sinon.assert.notCalled(seller_run_spy);
      sinon.assert.notCalled(seller_sell_spy);
      (algo.seller.profit).should.be.equal(50);
    });

    it("Next 12 runs", async () => {
      for (let i = 0; i < 12; i++) {
        sandbox.clock.tick(1000);
        await algo.run();

        sinon.assert.callCount(buyer_run_spy, 1 + i);
      }

      sinon.assert.notCalled(buyer_buy_spy);
      (algo.buyer.buyPercentage).should.be.equal(6);
    });

    it("Buy order placed", async () => {
      sandbox.clock.tick(1000);
      await algo.run();

      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: [require("../data/btc-buy-transaction.json")]
      });

      sinon.assert.calledOnce(buyer_run_spy);
      sinon.assert.calledOnce(buyer_buy_spy);
      (algo.buyer.buyPercentage).should.be.equal(20);
      sinon.assert.notCalled(seller_run_spy);
    });

    it("Buyer.run not called anymore", async () => {
      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: [require("../data/btc-buy-transaction.json")]
      });

      for (let i = 0; i < 10; i++) {
        sandbox.clock.tick(1000);
        await algo.run();
      }

      sinon.assert.notCalled(buyer_run_spy);
      sinon.assert.notCalled(seller_run_spy);
      (algo.buyer.buyPercentage).should.be.equal(20);
    });
  });

  describe("Completed buy transaction", async () => {
    before(() => {
      sandbox.clock.setSystemTime(0);
    });

    beforeEach(async () => {
      requestMock.mockPrice("BTC-USD", "buy", 1600);
      requestMock.mockPrice("BTC-USD", "sell", 1650);
      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: [_.merge({}, require("../data/btc-buy-transaction.json"), {
          "status": "completed",
        })]
      });
      requestMock.mockPath("/v2/accounts/test-account/sells", {
        data: require("../data/btc-sell.json")
      });
      requestMock.mockPath("/v2/accounts/test-account/sells/test-sell/commit", {
        data: require("../data/btc-sell.json")
      });
    });

    it("1st run", async () => {
      sandbox.clock.tick(1000);
      await algo.run();

      sinon.assert.notCalled(buyer_run_spy);
      sinon.assert.notCalled(buyer_buy_spy);
      (algo.buyer.buyPercentage).should.be.equal(20);
      sinon.assert.calledOnce(seller_run_spy);
      sinon.assert.notCalled(seller_sell_spy);
      (algo.seller.profit).should.be.equal(50);
    });

    it("2nd run", async () => {
      sandbox.clock.tick(1000);
      await algo.run();

      sinon.assert.notCalled(buyer_run_spy);
      sinon.assert.notCalled(buyer_buy_spy);
      (algo.buyer.buyPercentage).should.be.equal(20);
      sinon.assert.calledOnce(seller_run_spy);
      sinon.assert.notCalled(seller_sell_spy);
      (algo.seller.profit).should.be.equal(48);
    });

    it("Next 22 runs", async () => {
      for (let i = 0; i < 22; i++) {
        sandbox.clock.tick(1000);
        await algo.run();

        sinon.assert.callCount(seller_run_spy, 1 + i);
      }

      sinon.assert.notCalled(seller_sell_spy);
      (algo.seller.profit).should.be.equal(26);
    });

    it("Sell order placed", async () => {
      sandbox.clock.tick(1000);
      await algo.run();

      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: [
          require("../data/btc-sell-transaction.json"),
          _.merge({}, require("../data/btc-buy-transaction.json"), {
            "status": "completed",
          })
        ]
      });

      sinon.assert.calledOnce(seller_run_spy);
      sinon.assert.calledOnce(seller_sell_spy);
      (algo.seller.profit).should.be.equal(50);
      sinon.assert.notCalled(buyer_run_spy);
    });

    it("Seller.run not called anymore", async () => {
      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: [
          require("../data/btc-sell-transaction.json"),
          _.merge({}, require("../data/btc-buy-transaction.json"), {
            "status": "completed"
          })
        ]
      });

      for (let i = 0; i < 10; i++) {
        sandbox.clock.tick(1000);
        await algo.run();
      }

      sinon.assert.notCalled(buyer_run_spy);
      sinon.assert.notCalled(seller_run_spy);
      (algo.seller.profit).should.be.equal(50);
    });

    it("Seller transaction is completed", async () => {
      requestMock.mockPath("/v2/accounts/test-account/transactions", {
        data: [
          _.merge({}, require("../data/btc-sell-transaction.json"), {
            "status": "completed"
          }),
          _.merge({}, require("../data/btc-buy-transaction.json"), {
            "status": "completed"
          })
        ]
      });

      sandbox.clock.tick(1000);
      await algo.run();

      sinon.assert.calledOnce(buyer_run_spy);
      sinon.assert.notCalled(buyer_buy_spy);
      sinon.assert.notCalled(seller_run_spy);
      sinon.assert.notCalled(seller_sell_spy);
    });
  });

  after(() => {
    mongoose.disconnect();
    mockery.disable();
    sandbox.restore();
  });
});
