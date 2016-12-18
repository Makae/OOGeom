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
    
    element.querySelectorAll(".hljs-regexp").forEach(function(elm) {
      elm.className = elm.className.replace("hljs-regexp", "");
    });

    if(codepeeker) { 
      var cfg = config.codepeeker;
      cfg.container = element;
      new CodePeeker(cfg);
    }
  };

  CodeHighlighter.prototype.highlightCode = function(code, codepeeker) {
    code = hljs.highlight("javascript", code);
    return code.value;
  };

  CodeHighlighter.prototype.addCodePeeker = function(element, codepeeker) {
    var codepeeker = typeof codepeeker != "undefined" ? codepeeker : true;
    if(codepeeker) { 
      var cfg = config.codepeeker;
      cfg.container = element;
      new CodePeeker(cfg);
    }
  }

  return new CodeHighlighter;
})();
