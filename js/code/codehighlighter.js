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
  CodeHighlighter.prototype.highlightBlock = function(element) {
    hljs.highlightBlock(element);
  };

  return new CodeHighlighter;
})();
