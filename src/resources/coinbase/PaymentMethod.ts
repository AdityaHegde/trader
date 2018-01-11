const Decorators = require("../../Decorators");
const CoinbaseResource = require("./CoinbaseResource");
const Base = require("../../Base")

@Decorators.resource("payment_method")
@Decorators.resource_path("/v2/payment-methods")
@Decorators.model("CoinbasePaymentMethod")
class PaymentMethod extends CoinbaseResource {
  @Decorators.string()
  type;

  @Decorators.string()
  name;

  @Decorators.string()
  currency;

  @Decorators.objectId()
  buy_limit;

  @Decorators.objectId()
  sell_limit;

  @Decorators.objectId()
  instant_buy_limit;

  @Decorators.objectId()
  instant_sell_limit;

  @Decorators.objectId()
  deposit_limit;

  @Decorators.objectId()
  withdraw_limit;

  @Decorators.boolean()
  primary_buy;

  @Decorators.boolean()
  primary_sell;

  @Decorators.boolean()
  allow_buy;

  @Decorators.boolean()
  allow_sell;

  @Decorators.boolean()
  instant_buy;

  @Decorators.boolean()
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

@Decorators.model("CoinbasePaymentLimit")
class PaymentLimit extends Base {
  @Decorators.string()
  type;

  @Decorators.number()
  period_in_days;

  @Decorators.number()
  total;

  @Decorators.number()
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
