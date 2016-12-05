var ExampleBlock = function(config) {
  this.container = config.container;
  this.callbacks = config.callbacks || {};
  this.codelinks = config.codelinks || [];


  this.codeblock = this.container.querySelector(".codeblock");
  this.type = this.container.getAttribute("data-type");
  this.fn = this.codeblock.getAttribute("data-fn");
  this.autoexec = this.codeblock.getAttribute("data-autoexec") || false;

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

      onBeforeHTMLAppended : function(data) {
        for(var i = 0; i < self.codelinks.length; i++) {
          var cl = self.codelinks[i];
          for(var i = 0; i < cl.patterns.length; i++) {
            var pattern = cl.patterns[i]; 
            data.code = data.code.replace(pattern, cl.replace);
          }
        }
        return data;
      },

      onHTMLAppended : function() {
        var cfg = config.codepeeker;
        cfg.container = self.codeblock;
        codehighlighter.highlightBlock(self.codeblock);
        new CodePeeker(cfg);
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