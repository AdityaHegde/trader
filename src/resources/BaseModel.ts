const Base = require("../Base");

class BaseModel extends Base {
  // updateData(data) {
  //   super.updateData(data);
  // }

  static async getAll(parent) {
    let response = await this.api.sendRequest(
      `${parent ? parent.resource_path + "/" : ""}${this.resource_path}`,
      "GET"
    );
    return response.data &&
      Promise.all(response.data.map(resourceData => this.new(resourceData)));
  }

  static async get(id, parent) {
    let response = await this.api.sendRequest(
      `${parent ? parent.resource_path + "/" : ""}${this.resource_path}/${id}`,
      "GET"
    );
    return this.new(response.data);
  }

  static async create(data, parent) {
    let response = await this.api.sendRequest(
      (parent ? parent.resource_path + "/" : "") + this.resource_path,
      "POST",
      data
    );
    return this.new(response.data);
  }

  async commit() {
    let response = await this.constructor.api.sendRequest(
      this.resource_path + "/commit",
      "POST"
    );
    return this.updateData(response.data);
  }
}

module.exports = BaseModel;
