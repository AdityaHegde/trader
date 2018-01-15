const Base = require("../Base");
const MongooseDecorators = require("../decorators/Mongoose");

@MongooseDecorators.model("Algorithm")
class Algorithm extends Base {
  updateData(algorithmData) {
    return super.updateData(algorithmData);
  }

  run() {

  }
}

module.exports = Algorithm;
