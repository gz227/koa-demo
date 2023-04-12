const proto = (module.exports = {});

// 代理属性
defineProperty("request", "header");
defineProperty("request", "url");
defineProperty("response", "body");
defineProperty("response", "status");

function defineProperty(target, name) {
  // proto.__defineSetter__(name, function(val){
  //   return this[target][name] = val;
  // });

  // proto.__defineGetter__(name, function(){
  //   return this[target][name];
  // });
  Object.defineProperty(proto, name, {
    get() {
      return this[target][name];
    },

    set(value) {
      this[target][name] = value;
    },
  });
}
