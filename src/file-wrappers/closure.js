/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-COMPOSE **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/* eslint-disable */
(function handleJSClosure (root, dependencyRefs = {}) {

  'use strict';

  const dependencyKeys = Object.keys(dependencyRefs);
  const dependencies = dependencyKeys.reduce((reduction, key) => {
    const parts = (dependencyRefs[key].reference || dependencyRefs[key]).split('.');
    reduction[key] = parts.reduce((reduction2, part) => {
      return reduction2[part];
    }, root);
    return reduction;
  }, {});

  '{{content}}'

}(typeof window !== 'undefined' ? window : this, '{{vars.dependencies}}'));
/* eslint-enable */
