var app = (function($) {

  var main = {
    init : function () {
      var cel = CodeExampleLoader.instance();
      app.example_blocks = cel.loadCodeExamples(document.querySelector("body"));
    },

    

  };

  $(document).ready(function() {
      main.init();
  });

  return {
    example_blocks: null
  }
})(jQuery);