var ThreeJSExampleBlock = function(config) {
  this.container = config.container;
  this.callbacks = config.callbacks || {};
  this.camera_config = config.camera_config;

  this.canvas = null;
  this.showcase = null;
};

ThreeJSExampleBlock.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return;

  return this.callbacks[task](data);
};

ThreeJSExampleBlock.prototype.init = function() {
  this.canvas = document.getElementById('canvas');
  this.showcase = new Showcase({
    container: this.canvas,
    camera: this.camera_config
  });
  this.showcase.toggleAxis();
  this.showcase.registerControls();
  this.showcase.camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  this.trigger("onInit");
};

ThreeJSExampleBlock.prototype.clean = function() {
  this.showcase.cleanObjects();
  this.trigger("onClean");
};