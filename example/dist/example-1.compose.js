/** DO NOT EDIT **/
/** THIS FILE WAS CREATED FROM GULP-COMPOSE **/
/** TO PROPERLY MODIFY FILE, EDIT SRC FILES AND RUN BUILD TASKS **/
/** GULP-COMPOSE ENVIRONMENT.JS WRAPPER **/
(function handleJSEnvironment (root, factory) {

  const dependencyRefs = {"jquery":{"reference":"$","require":"jquery","define":"jquery"}};
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
    root.example_1 = factory.apply(root, deps);
  }

}(typeof window !== 'undefined' ? window : this, (...dependencies) => {

  
	function one () {
	  return dependencies.$;
	}
	
	
	function three () {
	  return 3;
	}
	
	three();
	
	
	function two () {
	  return 2;
	}
	
	two();
	
}));
