/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-COMPOSE **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/** GULP-COMPOSE CLOSURE.JS WRAPPER **/
(function handleJSClosure (root, dependencyRefs = {}) {

  const dependencyKeys = Object.keys(dependencyRefs);
  const dependencies = dependencyKeys.reduce((reduction, key) => {
    const parts = (dependencyRefs[key].reference || dependencyRefs[key]).split('.');
    reduction[key] = parts.reduce((reduction2, part) => {
      return reduction2[part];
    }, root);
    return reduction;
  }, {});

  
	function one () {
	  return 1;
	}
	
	
	function two () {
	  return 2;
	}
	
	
	function three () {
	  return 3;
	}
	

}(typeof window !== 'undefined' ? window : this, {"jquery":{"reference":"jQuery","require":"jquery","define":"jquery"}}));
