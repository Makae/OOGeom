
var TaskHandler = function(container) {
  this.container = container;
};

TaskHandler.prototype = {
  on_live_update : function() {
    this.execute_custom_task();
  },

  on_hash_changed : function() {
    if(window.location.hash == '')
      return;

    var fn =  window.location.hash.substring(1);
    var found = this.container.querySelector('option[value="' + fn + '"]');
    if(found == null)
        return;

    var task_selector = this.container.getElementById('task_selector');
    var opts = task_selector.options;
    for(var opt, j = 0; opt = opts[j]; j++) {
        if(opt.value == fn) {
            task_selector.selectedIndex = j;
            break;
        }
    }
    task_selector.onchange();
  },

  on_task_changed : function() {
    var task_selector = this.container.getElementById("task_selector");
    if(task_selector.value == "none")
      return;

    var fn = window[task_selector.value];
    if(typeof fn != 'function')
      return;

    var base = window.location.href.split("#")[0];
    window.location.href = base + "#" + task_selector.value;
    this.execute_predefined_task(fn)
  },

  update_task_selection : function() {
    var option;

    var task_selector = this.container.getElementById("task_selector");
    var list = getFunctionList();

    while(task_selector.length > 0)
      task_selector.remove(0);

      option = this.container.createElement("option");
      option.text = " - SELECT - ";
      option.value = "none";
      task_selector.add(option);

    for(var i in list) {
      option = this.container.createElement("option");
      option.text = i;
      option.value = i;
      task_selector.add(option);
    }
  },

  get_function_list : function() {
    var list = {};

    for(var k in window) {
      if(typeof window[k] != 'function')
        continue;
   
      if(!k.match('^task_'))
        continue;

      list[k] = window[k];
    }

    return list;
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

    this.container.getElementById("code").innerHTML = code;
    hljs.highlightBlock(this.container.getElementById("code"))

    this.execute_task(task);
  },

  execute_task : function(task) {
    showcase.cleanObjects();
    task();
  }
};


