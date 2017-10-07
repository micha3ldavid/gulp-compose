"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-COMPOSE **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/** GULP-COMPOSE ENVIRONMENT.JS WRAPPER **/
(function handleJSEnvironment(root, factory) {

  var dependencyRefs = { "jquery": { "reference": "$", "require": "jquery", "define": "jquery" } };
  var dependencyKeys = Object.keys(dependencies);

  if (typeof define === 'function' && define.amd) {
    var deps = dependencyKeys.map(function (key) {
      return dependencyRefs[key].define || dependencyRefs[key];
    });
    define(deps, function () {
      for (var _len = arguments.length, dependencies = Array(_len), _key = 0; _key < _len; _key++) {
        dependencies[_key] = arguments[_key];
      }

      return factory.apply.apply(factory, [root].concat(dependencies));
    });
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    var _deps = dependencyKeys.map(function (key) {
      return dependencyRefs[key].require || dependencyRefs[key];
    });
    module.exports = factory.apply(root, _deps);
  } else {
    var _deps2 = dependencyKeys.map(function (key) {
      var parts = (dependencyRefs[key].reference || dependencyRefs[key]).split('.');
      return parts.reduce(function (reduction, part) {
        return reduction[part];
      }, root);
    });
    root.example_1 = factory.apply(root, _deps2);
  }
})(typeof window !== 'undefined' ? window : undefined, function () {
  for (var _len2 = arguments.length, dependencies = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    dependencies[_key2] = arguments[_key2];
  }

  function one() {
    return dependencies.$;
  }

  function three() {
    return 3;
  }

  three();

  function two() {
    return 2;
  }

  two();
});