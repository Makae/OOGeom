var CodeExampleLoader = function() {};

CodeExampleLoader.__INSTANCE__ = null;

CodeExampleLoader.instance = function() {
  if(CodeExampleLoader.__INSTANCE__ == null)
    CodeExampleLoader.__INSTANCE__ = new CodeExampleLoader();
  
  return CodeExampleLoader.__INSTANCE__;
};

CodeExampleLoader.prototype.loadCodeExamples = function(context) {
  var examples = context.querySelectorAll(".example_block");
  var example_blocks = [];
  for(var i = 0; i < examples.length; i++) {
    example_blocks.push(this.prepareExampleBlock(examples[i]));
  }
  return example_blocks;
};

CodeExampleLoader.prototype.prepareExampleBlock = function(example_block_container) {
  var cfg = config.example_block;
  cfg.container = example_block_container;
  var example_block = new ExampleBlock(cfg);

  var display_element;
  switch(example_block.type) {
      case "threejs-orto":
        display_element = new ThreeJSCodeExample({
          context: example_block_container,
          camera_config: config.camera.orto
        });
      break;
  }

  example_block.callbacks.onExecuteCode = function() {
    if(display_element)
      display_element.clean();
  };

  example_block.callbacks.onPreInit = function() {
    if(display_element)
      display_element.init();
  };

  example_block.init();
  example_block.execute();

  return example_block;
};