var showcase;
function body_loaded() {
    init();
    showcase.toggleAxis();
    //showcase.toggleGrid();

    showcase.registerControls();
    showcase.camera.lookAt(new THREE.Vector3(0, 0, 0));

     a1_2d();
    // homogenous_rotation_2d();
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