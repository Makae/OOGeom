var app = (function() {

    var App = function(config) {
      this.config = config || {};
      this.callbacks = config.callbacks || {};
    };

    App.prototype.init = function () {
      var self = this;

      ContentLoader.setBase(this.config.content_path);

      var ac = document.querySelector("[data-async-container='main']");

      app.async_content = new AsyncContent({
        container: ac,
        callbacks: {
          onContentLoaded: function(data) {
            self.onAfterReplaceContent(data);
          }
        }
      });

      app.async_content.loadDefaultContents(function() {
        self.updateMainContainerBindings();
      });
    };

    App.prototype.onContentLoaded = function(data) {
      if(data.target_id != 'main')
        return;

      this.updateMainContainerBindings();
    };

    App.prototype.updateMainContainerBindings = function() {
      var ac = document.querySelector("[data-async-container='main']");
      ExampleBlockBuilder.buildBlocksInContainer(ac, function() {
        app.example_blocks = CodeExampleLoader.instance().loadCodeExamples(ac);
        app.async_content.registerLinks();
      });
      
    };

    return new App(config.app);

})();