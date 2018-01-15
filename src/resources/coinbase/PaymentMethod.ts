const MongooseDecorators = require("../../decorators/Mongoose");
const CoinbaseResource = require("./CoinbaseResource");
const Base = require("../../Base")

@CoinbaseResource.resource("payment_method")
@CoinbaseResource.resource_path("/v2/payment-methods")
@MongooseDecorators.model("CoinbasePaymentMethod")
class PaymentMethod extends CoinbaseResource {
  @MongooseDecorators.string()
  type;

  @MongooseDecorators.string()
  name;

  @MongooseDecorators.string()
  currency;

  @MongooseDecorators.objectId()
  buy_limit;

  @MongooseDecorators.objectId()
  sell_limit;

  @MongooseDecorators.objectId()
  instant_buy_limit;

  @MongooseDecorators.objectId()
  instant_sell_limit;

  @MongooseDecorators.objectId()
  deposit_limit;

  @MongooseDecorators.objectId()
  withdraw_limit;

  @MongooseDecorators.boolean()
  primary_buy;

  @MongooseDecorators.boolean()
  primary_sell;

  @MongooseDecorators.boolean()
  allow_buy;

  @MongooseDecorators.boolean()
  allow_sell;

  @MongooseDecorators.boolean()
  instant_buy;

  @MongooseDecorators.boolean()
  instant_sell;


  async updateData(paymentMethodData) {
    this.type = paymentMethodData.type;
    this.name = paymentMethodData.name;
    this.currency = paymentMethodData.currency;

    await Promise.all(["buy", "sell", "instant_buy", "instant_sell", "withdraw", "deposit"].map(
      (limitType) => {
        // TODO why is the limit an array!?
        if (paymentMethodData.limits[limitType] && paymentMethodData.limits[limitType].length > 0) {
          return PaymentLimit.new({
            paymentMethodId: paymentMethodData.id,
            type: limitType,
            limitData: paymentMethodData.limits[limitType][0],
          }).then((paymentLimit) => {
            this[limitType + "_limit"] = paymentLimit;
            return true;
          });
        }
        return Promise.resolve();
      }
    ));

    this.primary_buy = paymentMethodData.primary_buy;
    this.primary_sell = paymentMethodData.primary_sell;
    this.allow_buy = paymentMethodData.allow_buy;
    this.allow_sell = paymentMethodData.allow_sell;
    this.instant_buy = paymentMethodData.instant_buy;
    this.instant_sell = paymentMethodData.instant_sell;

    return super.updateData(paymentMethodData);
  }
}

@MongooseDecorators.model("CoinbasePaymentLimit")
class PaymentLimit extends Base {
  @MongooseDecorators.string()
  type;

  @MongooseDecorators.number()
  period_in_days;

  @MongooseDecorators.number()
  total;

  @MongooseDecorators.number()
  remaining;


  updateData(paymentLimitData) {
    this.id = paymentLimitData.paymentMethodId + "_" + paymentLimitData.type;
    this.type = paymentLimitData.type;
    this.period_in_days = paymentLimitData.limitData.period_in_days;
    this.total = Number(paymentLimitData.limitData.total.amount);
    this.remaining = Number(paymentLimitData.limitData.remaining.amount);

    return super.updateData(paymentLimitData);
  }
}

module.exports = PaymentMethod;
