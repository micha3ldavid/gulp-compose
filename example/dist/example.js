/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-SMASH **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/* eslint-disable */
(function handleJSEnv (root, factory) {

  if (typeof define === 'function' && define.amd) {
    const defineDependencies = '{{defineDependencies}}';
    define(defineDependencies, (...dependencies) => (
      factory.apply(root, ...dependencies)
    ));
  }
  else if (typeof module === 'object' && module.exports) {
    const requiredDependencies = '{{requires}}';
    module.exports = factory.apply(root, requiredDependencies);
  }
  else {
    const global = root;
    const namespace = 'undefined'.split('.');
    const referenceDependencies = '{{references}}';

    let obj = global;

    for (let i = 0, l = namespace.length - 1; i < l; i += 1) {
      obj[namespace[i]] = obj[namespace[i]] || {};
      obj = obj[namespace[i]];
    }
    obj[namespace[namespace.length - 1]] = factory.apply(root, referenceDependencies);
  }

}(typeof window !== 'undefined' ? window : this, (...dependencies) => {
  
function one () {
  return 1;
}


function two () {
  return 2;
}


function three () {
  return 3;
}

}));
/* eslint-enable */
