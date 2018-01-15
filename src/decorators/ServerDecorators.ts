const express = require("exporess");

class ServerDecorators {
  static get(path, method = "get") {
    return function(classPrototype, fieldName, descriptor) {
      if (!classPrototype.hasOwnProperty("__routes")) {
        classPrototype.__routes = _.cloneDeep(classPrototype.__routes || {});
      }

      if (!classPrototype.__routes.hasOwnProperty(fieldName)) {
        classPrototype.__routes[fieldName] = _.cloneDeep(classPrototype.__routes[fieldName] || {});
      }

      classPrototype.__routes[fieldName][method] = path;
    }
  }

  static post(path) {
    return this.get(path, "post");
  }

  static put(path) {
    return this.get(path, "put");
  }

  static authenticated() {
    return function(classPrototype, fieldName, descriptor) {
      if (!classPrototype.hasOwnProperty("__routes")) {
        classPrototype.__routes = _.cloneDeep(classPrototype.__routes || {});
      }

      if (!classPrototype.__routes.hasOwnProperty(fieldName)) {
        classPrototype.__routes[fieldName] = _.cloneDeep(classPrototype.__routes[fieldName] || {});
      }

      classPrototype.__routes[fieldName].authenticated = true;
    }
  }
}

module.exports = ServerDecorators;
