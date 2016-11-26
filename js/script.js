(function($) {

  var main = {
    init : function () {
      debugger;
      this.loadCodeExamples();
    },

    loadCodeExamples : function(context) {
      debugger;
      var examples = document.querySelectorAll(".example_block");
      var exmample_blocks = [];
      for(var i = 0; i < examples.length; i++) {
        this.prepareExampleBlock(examples[i]);
      }
    },

    prepareExampleBlock : function(container) {
      var example_block = new ExampleBlock({
              container: container
            });

      var display_element;
      switch(example_block.type) {
          case "threejs-ortho":
            display_element = ThreeJSCodeExample({
              container: container,
              camera: config.camera.orto
            });

            example_block.callbacks.onExecuteCode = function() {
              tce.clean();
            };

            example_block.callbacks.onPreInit = function() {
              tce.init();
            };
          break;
      }

      example_block.init();
    }

  };

  $(document).ready(function() {
      main.init();
  });
})(jQuery);