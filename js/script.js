(function($) {
  $(document).on("loaded", function() {

  });
})(jQuery);

var 

var showcase;
function on_body_loaded() {
    init();
    showcase.toggleAxis();
    //showcase.toggleGrid();

    showcase.registerControls();
    showcase.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // run_tests();
    // homogenous_rotation_2d();
    hljs.initHighlightingOnLoad();
    updateTaskSelection();
    loadTaskFromHash();

    document.getElementById("execute_code").onclick = function() {
      TaskHandler.execute_custom_task();
    };


    var identifier = null;
    window.setInterval(function() {
      var _new_identifier = DynamicCode.to_identifier(DynamicCode.get_values());
      
      if(!document.getElementById("live_update").checked)
        return;

      if(_new_identifier == identifier)
        return;

      if(identifier != null)
        TaskHandler.on_live_update();

      identifier = _new_identifier;
    }, 200);
}


function init() {
    var camera = {
      'x' : 0,
      'y' : 0,
      'z' : 200,
      'near' : 1,
      'far' : 6000,
      'fov' : 60,
      'minDistance' : 100,
      'maxDistance' : 6000 / 8
    }
    var container = document.getElementById('canvas');
    showcase = new Showcase({
            container: container,
            camera: camera
    });
}