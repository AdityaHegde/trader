const sinon = require("sinon");

class RequestMock {
  constructor(sandbox) {
    this.stub = sandbox.stub();
  }

  mockPath(path, data) {
    this.stub.withArgs(sinon.match({
      url: path
    })).returns(JSON.stringify(data));
  }

  mockPrice(exchance, type, amount) {
    this.mockPath(`/v2/prices/${exchance}/${type}`, {
      data: {
        amount: amount + "",
        currency: "USD"
      }
    });
  }
}

module.exports = RequestMock;
