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

var TaskHandler = {
  on_live_update : function() {
    TaskHandler.execute_custom_task();
  },

  on_hash_changed : function() {
    loadTaskFromHash();
  },

  on_task_changed : function() {
    var task_selector = document.getElementById("task_selector");
    if(task_selector.value == "none")
      return;

    var fn = window[task_selector.value];
    if(typeof fn != 'function')
      return;

    var base = window.location.href.split("#")[0];
    window.location.href = base + "#" + task_selector.value;
    this.execute_predefined_task(fn)
  },

  execute_custom_task : function() {
    var task;
    try {
      task = DynamicCode.prepare_custom_task(DynamicCode.active_code);
    } catch(e) {
      console.error("Invalid Value"); 
      throw e;
      return;
    }
    this.execute_task(task);
  },

  execute_predefined_task : function(task) {
    var code = task.toString();
    code = DynamicCode.prepare_code(code);

    document.getElementById("code").innerHTML = code;
    hljs.highlightBlock(document.getElementById("code"))

    this.execute_task(task);
  },

  execute_task : function(task) {
    showcase.cleanObjects();
    task();
  }
};


var DynamicCode = {
  active_code: null,
  fields :  {
    float: {
      pattern : /(-?\d+(\.\d)?)\/\*\s?#(float)\*\//g,
      input: '<input class="float" type="number" step="0.1" value="$1" />',
      tpl_var: '%$float%',
      tpl_var_pattern: /%\$float%/gi,
      validate : function(val) {
        return !isNaN(val)
      }
    },
    color: {
      pattern : /(0x([0-9a-fA-F]{6}))\/\*\s?#(color)\*\//g,
      input: '<input class="color" type="color" value="#$2" />',
      tpl_var: '%$color%',
      tpl_var_pattern: /%\$color%/gi,

      convertToHTML: function(val) {
        return 
      },

      convertToScript: function(val) {
        val = val.slice(1);
        return eval("0x" + val);
      },

      validate : function(val) {
        return true
      }
    }
  },

  prepare_code : function(code) {
      this.active_code = (' ' + code).slice(1).replace(this.fields.float.pattern, this.fields.float.tpl_var);
      this.active_code = this.active_code.replace(this.fields.color.pattern, this.fields.color.tpl_var);
      
      var code = code.replace(this.fields.float.pattern, this.fields.float.input);
      code = code.replace(this.fields.color.pattern, this.fields.color.input);

      code = code.replace(new RegExp("\n", 'g'), "<br />\n");
      code = code.replace(/^([^\/])*\/\/(.*)$/, '$1\/\* $2 \*\/');

      return code;
  },

  prepare_custom_task : function() {
    var values = this.get_values();
    this.validate_values(values);

    var task = this.replace_template_values(this.active_code, this.fields.float.tpl_var_pattern , values.float);
    task = this.replace_template_values(task, this.fields.color.tpl_var_pattern , values.color);

    var pattern_fn_rename = /(\s?function\s+)([a-zA-Z0-9_]+)(.*)/;
    var fn_prefix = '__custom_';
    
    var matches = task.match(pattern_fn_rename);
    task = task.replace(pattern_fn_rename, '$1 ' + fn_prefix + '$2$3');
    eval.call(window, task);

    return window[fn_prefix + matches[2]];
  },

  replace_template_values : function(code, pattern, values) {
    var idx = -1;
    var replaced = code.replace(pattern, function(match) {
      return values[++idx];
    });
    return replaced;
  },

  get_values : function(values) {
    var container = document.getElementById("code");
    var fields = document.getElementsByTagName("input");
    var values = {
      float: [],
      color: [],
    };

    for(var i in fields) {
      var field = fields[i];
      if(DOMUtils.hasClass(field, 'float'))
        values.float.push(field.value);

      if(DOMUtils.hasClass(field, 'color'))
        values.color.push(this.fields.color.convertToScript(field.value));
    }

    return values;
  },

  validate_values: function(values) {
    for(var k in values.float)
      if(!this.fields.float.validate(values.float[k]))
        throw new Error("NaN")

    for(var k in values.color)
      if(!this.fields.color.validate(values.color[k]))
        throw new Error("NaC")
    return true;
  },

  to_identifier: function(values) {
    var identifier = '';
    
    for(var i in values) {
      for(var k in values[i])
      identifier += i + '-' + k +'_' + values[i][k].toString();
    }
    return identifier;
  }
};

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