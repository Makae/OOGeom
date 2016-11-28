var ThreeJSCodeExample = function(config) {
  this.context = config.context;
  this.callbacks = config.callbacks || {};
  this.camera_config = config.camera_config;

  this.canvas = null;
  this.showcase = null;
};

ThreeJSCodeExample.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return;

  return this.callbacks[task](data);
};

ThreeJSCodeExample.prototype.init = function() {
  this.canvas = this.context.querySelector('.canvas_container');
  this.showcase = new Showcase({
    container: this.canvas,
    camera: this.camera_config
  });

  this.showcase.toggleAxis();
  this.showcase.registerControls();
  this.showcase.camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  this.trigger("onInit");
};

ThreeJSCodeExample.prototype.clean = function() {
  this.showcase.cleanObjects();
  
  PrintUtils.setContext(this.showcase);
  
  this.trigger("onClean");
};