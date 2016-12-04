var app = (function() {

    var App = function(config) {
      this.config = config || {};
      this.callbacks = config.callbacks || {};
    };

    App.prototype.init = function () {
      var self = this;

      ContentLoader.setBase(this.config.content_path);

      var ac = document.querySelector("[data-async-container='main']");
      var cel = CodeExampleLoader.instance();
      app.example_blocks = cel.loadCodeExamples(ac);
      app.async_content = new AsyncContent({
        container: ac,
        callbacks: {
          onContentLoaded: function(data) { self.onAfterReplaceContent(data); }
        }
      });
      app.async_content.registerLinks();
    };

    App.prototype.onContentLoaded = function(data) {
      debugger;
      if(data.target_id != 'main')
        return;

      var ac = document.querySelector("[data-async-container='main']");
      app.async_content.registerLinks();
      app.example_blocks = cel.loadCodeExamples(ac);
    };

    return new App(config.app);

})();