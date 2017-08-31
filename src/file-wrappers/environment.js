/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-SMASH **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/* eslint-disable */
(function handleJSEnvironment (root, factory) {

  const dependencyRefs = '{{vars.dependencies}}';
  const dependencyKeys = Object.keys(dependencies);

  if (typeof define === 'function' && define.amd) {
    const deps = dependencyKeys.map((key) => {
      return dependencyRefs[key].define || dependencyRefs[key];
    });
    define(deps, (...dependencies) => (
      factory.apply(root, ...dependencies)
    ));
  }
  else if (typeof module === 'object' && module.exports) {
    const deps = dependencyKeys.map((key) => {
      return dependencyRefs[key].require || dependencyRefs[key];
    });
    module.exports = factory.apply(root, deps);
  }
  else {
    const deps = dependencyKeys.map((key) => {
      const parts = (dependencyRefs[key].reference || dependencyRefs[key]).split('.');
      return parts.reduce((reduction, part) => {
        return reduction[part];
      }, root);
    });
    root.'{{vars.namespace}}' = factory.apply(root, deps);
  }

}(typeof window !== 'undefined' ? window : this, (...dependencies) => {

  'use strict';

  '{{content}}'
}));
/* eslint-enable */
