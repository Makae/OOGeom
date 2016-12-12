var ExampleBlockBuilder = (function() {

  var ExampleBlockBuilder = function(config) {
    this.config = config;
    this.tpls = {};
  };


  ExampleBlockBuilder.prototype.buildBlocksInContainer = function(context, callback) {
    var template_blocks = context.querySelectorAll(".example_block_template");
    
    var num_blocks = template_blocks.length;
    var on_block_built = function() {
      if(--num_blocks <= 0)
        callback();
    };
    for(var i = 0; i < template_blocks.length; i++) {
        this.buildTemplateBlock(template_blocks[i], on_block_built);
    }
  };

  ExampleBlockBuilder.prototype.buildTemplateBlock = function(template_block, callback) {
    var self = this;

    var type = template_block.getAttribute("data-type");
    var fn = template_block.getAttribute("data-fn");
    var autoexec = template_block.getAttribute("data-autoexec");
    var executable = template_block.getAttribute("data-executable");

    template_block.setAttribute("data-loading", "1");

    var build = function(html) {
      html = html.replace("$type", type);
      html = html.replace("$fn", fn);
      html = html.replace("$autoexec", autoexec);
      html = html.replace("$executable", executable);

      self.replaceTemplate(template_block, html);
      callback();
    };

    this.loadTemplateBlock(this.getTemplateName(type), build);
  };

  ExampleBlockBuilder.prototype.getTemplateName = function(type) {
    return this.config[type].tpl;
  };

  ExampleBlockBuilder.prototype.replaceTemplate = function(element, html) {
    element.insertAdjacentHTML("beforebegin", html);
    element.parentNode.removeChild(element);
  };

  ExampleBlockBuilder.prototype.loadTemplateBlock = function(tpl, callback) {
    var self = this;
    if(typeof this.tpls[tpl] != "undefined") {
      callback(this.tpls[tpl]);
      return;
    }

    ContentLoader.load(tpl, function(request) {
      self.tpls[tpl] = request.result.data;
      callback(request.result.data);
    });
  };

  return new ExampleBlockBuilder(config.block_builder);
})();
