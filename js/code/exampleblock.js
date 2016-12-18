var ExampleBlock = function(config) {
  this.container = config.container;
  this.callbacks = config.callbacks || {};

  this.codeblock = this.container.querySelector(".codeblock");
  this.type = this.container.getAttribute("data-type");
  this.fn = this.codeblock.getAttribute("data-fn");
  this.autoexec = this.codeblock.getAttribute("data-autoexec") || false;
  this.executable = this.codeblock.getAttribute("data-executable") == "0" ? 0 : 1;
  this.container.setAttribute("data-executable", this.executable);

  this.dcc = null;
};

ExampleBlock.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return data;

  return this.callbacks[task](data);
};

ExampleBlock.prototype.init = function() {
  var self = this;
  
  this.trigger("onPreInit");

  this.dcc = new DynamicCodeContainer({
    container: this.codeblock,
    callbacks : {
      onFieldChange: function() {
        self.onFieldChange();
      },

      onBeforeLoadNewCode : function(data) {
        data.code = codehighlighter.highlightCode(data.code);
        return data;
      },

      onBeforeHTMLAppended : function(data) {
        data.code = codehighlighter.prepareCode(data.code)
        return data;
      },

      onHTMLAppended : function(data) {
        codehighlighter.addCodePeeker(data.container);
        data.container.className += " hljs";
        return data;
      }
    }
  });
  
  this.dcc.loadNewCode(window[this.fn].toString());

  this.registerHandlers();

  this.trigger("onInit");
};

ExampleBlock.prototype.registerHandlers = function() {
  var self = this;

  var execute = this.container.querySelector("button[name='execute']");
  var autoexec = this.container.querySelector("input[name='live_update']");
  
  execute.addEventListener("click", function() {
    self.execute();
  });

  autoexec.addEventListener("change", function() {
    self.setAutoexec(this.checked);
  });
};

ExampleBlock.prototype.setAutoexec = function(autoexec) {
  this.autoexec = autoexec;
};

ExampleBlock.prototype.onFieldChange = function(field) {
  if(this.autoexec)
    this.execute();
};

ExampleBlock.prototype.execute = function() {
  if(!this.executable)
    return;

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
  if(false === this.trigger("onExecuteCode", {fn: fn}))
    return;
  fn();
};