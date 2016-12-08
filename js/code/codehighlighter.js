var codehighlighter = (function() {
  var instance;

  var CodeHighlighter = function() {
    if(instance)
      return instance;

  }

  CodeHighlighter.prototype.prepareCode = function(code) {
    code = code.replace(new RegExp("\n", 'g'), "<br />\n");
    // Replace single slash comments with slash star comments
    code = code.replace(/^([^\/])*\/\/(.*)$/g, '$1\/\* $2 \*\/');
    code = code.replace(/(\s{2})/g, '<span class="space">$1</span>');
    
    return code;
  };

  CodeHighlighter.prototype.highlightBlock = function(element, codepeeker) {
    var codepeeker = typeof codepeeker != "undefined" ? codepeeker : true;

    hljs.highlightBlock(element);
   
    if(codepeeker) { 
      var cfg = config.codepeeker;
      cfg.container = element;
      new CodePeeker(cfg);
    }
  };

  return new CodeHighlighter;
})();
