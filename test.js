/*
 * @Date: 2019-09-12 11:32:49
 * @LastEditors: xieminhui
 * @LastEditTime: 2019-11-13 17:02:22
 */
(function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]);
    }

    const module = {
      exports: {}
    };
    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0);
})({
  0: [
    function (require, module, exports) {
      "use strict";

      var _message = require("./message.js");

      var _message2 = _interopRequireDefault(_message);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      console.log(_message2.default);
      /*
       * @Date: 2019-09-11 15:32:01
       * @LastEditors: xieminhui
       * @LastEditTime: 2019-09-11 15:32:01
       */
    },
    {
      "./message.js": 1
    },
  ],
  1: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _name = require("./name.js");

      exports.default = "hello " + _name.name;
      /*
       * @Date: 2019-09-11 15:32:40
       * @LastEditors: xieminhui
       * @LastEditTime: 2019-09-11 15:32:40
       */
    },
    {
      "./name.js": 2
    },
  ],
  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      /*
       * @Date: 2019-09-11 15:32:48
       * @LastEditors: xieminhui
       * @LastEditTime: 2019-09-11 15:32:48
       */
      var name = exports.name = 'world';
    },
    {},
  ],
});