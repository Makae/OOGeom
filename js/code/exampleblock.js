var ExampleBlock = function(config) {
  this.container = config.container;
  this.callbacks = config.callbacks || {};
  this.type = null;
  this.fn = null;
  this.dcc = null;
};

ExampleBlock.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return;

  return this.callbacks[task](data);
};

ExampleBlock.prototype.init = function() {
  
  this.type = this.container.getAttribute("data-type");
  this.fn = this.container.getAttribute("data-fn");
  
  this.trigger("onPreInit");
  this.dcc = new DynamicCodeContainer(this.container.querySelector(".codeblock"));
  this.dcc.prepareNewCode(window[fn].toString());
  this.trigger("onInit");
};

ExampleBlock.prototype.executeCustomCode = function() {
  var code;
  try {
    code = this.dcc.prepareCustomCode();
  } catch(e) {
    console.error("Invalid Value"); 
    throw e;
    return;
  }
  this.executeCode(code);
};


ExampleBlock.prototype.executeCode = function(fn) {
  if(!this.trigger("onExecuteCode", {fn: fn}))
    return;
  fn();
};