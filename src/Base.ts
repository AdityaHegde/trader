const mongoose = require("mongoose");
const Decorators = require("./Decorators");
const _ = require("lodash");

class Base {
  @Decorators.string()
  id;

  // __mongooseModel = null;
  __mongooseInstance = null;

  constructor(data) {
    this.__data = {};
    this.__cache = {};
  }

  async updateData(data) {
    await this.updateRecord();
  }

  async updateRecord() {
    if (this.__mongooseModel) {
      this.__mongooseInstance = await this.__mongooseModel.findOneAndUpdate({ id: this.id }, this.__data, { new: true, upsert: true });
      _.forIn(this.__schema, (type, field) => {
        if (type !== mongoose.Schema.Types.ObjectId) {
          this.__data[field] = this.__mongooseInstance[field];
          this.__cache[field] = this.__mongooseInstance[field];
        }
      });
    }
  }

  static async new(data) {
    let instance = new this(data);
    await instance.updateData(data);
    return instance;
  }

  static remove(query) {
    return this.__mongooseModel.remove(query);
  }
}

module.exports = Base;
