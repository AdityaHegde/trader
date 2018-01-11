const Base = require("../Base");
const Decorators = require("../Decorators");

@Decorators.model("Algorithm")
class Algorithm extends Base {
  updateData(algorithmData) {
    return super.updateData(algorithmData);
  }

  run() {

  }
}

module.exports = Algorithm;
