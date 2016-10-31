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
}

function on_hash_changed() {
  loadTaskFromHash();
}

function on_task_changed() {
  var task_selector = document.getElementById("task_selector");
  if(task_selector.value == "none")
    return;

  var fn = window[task_selector.value];
  if(typeof fn != 'function')
    return;

  var base = window.location.href.split("#")[0];
  window.location.href = base + "#" + task_selector.value;
  execute_task(fn)
}

function execute_task(task) {
  showcase.cleanObjects();
  task();


  var code = task.toString();
  code = code.replace(new RegExp("\n", 'g'), "<br />\n");
  code = code.replace(/^([^\/])*\/\/(.*)$/, '$1\/\* $2 \*\/');

  document.getElementById("code").innerHTML = code;
  hljs.highlightBlock(document.getElementById("code"))
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

function loadTaskFromHash() {
   if(window.location.hash == '')
      return;

    var fn =  window.location.hash.substring(1);
    var found = document.querySelector('option[value="' + fn + '"]');
    if(found == null)
        return;

    var task_selector = document.getElementById('task_selector');
    var opts = task_selector.options;
    for(var opt, j = 0; opt = opts[j]; j++) {
        if(opt.value == fn) {
            task_selector.selectedIndex = j;
            break;
        }
    }
    task_selector.onchange();
}

function updateTaskSelection() {
  var option;

  var task_selector = document.getElementById("task_selector");
  var list = getFunctionList();

  while(task_selector.length > 0)
    task_selector.remove(0);

    option = document.createElement("option");
    option.text = " - SELECT - ";
    option.value = "none";
    task_selector.add(option);

  for(var i in list) {
    option = document.createElement("option");
    option.text = i;
    option.value = i;
    task_selector.add(option);
  }
}

function getFunctionList() {
  var list = {};

  for(var k in window) {
    if(typeof window[k] != 'function')
      continue;
 
    if(!k.match('^task_'))
      continue;

    list[k] = window[k];
  }

  return list;
}