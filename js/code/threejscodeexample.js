var ThreeJSCodeExample = function(config) {
  this.context = config.context;
  this.callbacks = config.callbacks || {};
  this.camera_config = config.camera_config;

  this.camera_distance =  config.context.hasAttribute("data-cameradistance") && config.context.getAttribute("data-cameradistance") != "" ? parseInt(config.context.getAttribute("data-cameradistance")) : 100;
  var camera_pos =  config.context.hasAttribute("data-camerapos") && config.context.getAttribute("data-camerapos") != "" ? config.context.getAttribute("data-camerapos") : false;
  if(camera_pos) {
    camera_pos = camera_pos.split(",");
    config.camera_config.x = camera_pos[0];
    config.camera_config.y = camera_pos[1];
    config.camera_config.z = camera_pos[2];
  }
  this.canvas = null;
  this.showcase = null;
};

ThreeJSCodeExample.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return data;

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
 
  this.showcase.setOrthoDistance(this.camera_distance);

  this.trigger("onInit");
};

ThreeJSCodeExample.prototype.clean = function() {
  this.showcase.cleanObjects();
  
  PrintUtils.setContext(this.showcase);
  
  this.trigger("onClean");
};