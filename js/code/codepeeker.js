var CodePeeker = (function(){
  var counter = 0;

  function CodePeeker(config) {
    this.config = config;
    this.container = config.container;
    this.registerHandlers(this.container);
  };

  CodePeeker.prototype.trigger = function(task, data) {
    data = data || {};
    data.instance = this;
    
    if(typeof this.callbacks[task] == "undefined")
      return data;

    return this.callbacks[task](data);
  };

  CodePeeker.prototype.peekCode = function(element) {
    var identifier = element.getAttribute("data-codepeeker-fn");
    var idx = element.getAttribute("data-codepeeker-id");
    var dimensions = this.getPeekDimension(element);

    this.hidePeeks();
    this.showPeek(idx, dimensions, identifier); 
  };

  CodePeeker.prototype.getPeekDimension = function(element) {
    var rect = element.getBoundingClientRect();
    var width = this.config.width;
    var height = this.config.height;
    var left = rect.left;
    var top = rect.top + rect.height;
    
    var too_wide = Math.max(left + width - window.innerWidth, 0);

    // Adjust left
    left = left - too_wide;

    // Adjust width if we shifted over the left edge
    if(too_wide > 0) {
      width = width + Math.max(0, left);
      left = Math.max(0, left);
    }

    return {
      left: left,
      top: top,
      width: width,
      height: height
    }
    
  };

  CodePeeker.prototype.hidePeeks = function() {
    var elements = document.querySelectorAll("div.codepeek-wrapper");
    for(var i = 0; i < elements.length; i++)
      elements[i].parentElement.removeChild(elements[i]);
  };

  CodePeeker.prototype.showPeek = function(idx, dimensions, identifier) {
    var self = this;
    var code = this.loadCode(identifier);
    var style = 'position:absolute; top: ' + dimensions.top + 'px; left:' + dimensions.left + 'px; max-width:' + dimensions.width + 'px; max-height:' + dimensions.height + 'px';
    var html = 
      '<div class="codepeek-wrapper" style="' + style + '" data-codepeeker-idx="' + idx + '">' +
        '<span class="glyphicon glyphicon-remove close"></span>' +
        '<code class="codepeeker javascript">' + code + '</code>' +
      '</div>';
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    document.querySelector("body").appendChild(wrapper.querySelector("div.codepeek-wrapper"));
    
    var cp_wrapper_elm =  document.querySelector("[data-codepeeker-idx='" + idx + "']");
    var code_elm = cp_wrapper_elm.querySelector("code");

    codehighlighter.highlightBlock(code_elm);
    
    cp_wrapper_elm.style.height = code_elm.offsetHeight + "px";
    cp_wrapper_elm.style.width = code_elm.offsetWidth + "px";
    

    cp_wrapper_elm.querySelector(".close").addEventListener("click", function() {
      self.hidePeeks();
    });


  };

  CodePeeker.prototype.loadCode = function(identifier) {
    var elms = identifier.split(".");
    var ref = window;
    for(var i = 0; i < elms.length; i++){
      ref = ref[elms[i]];
    }

    var code = ref.toString();

    return codehighlighter.prepareCode(code);
  };

  CodePeeker.prototype.registerHandlers = function(container) {
    var self = this;
    var elements = container.querySelectorAll("[data-codepeeker-fn]");
    for(var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.setAttribute("data-codepeeker-id", counter++);
      element.addEventListener("click", function() {
        self.peekCode(this);
      });
    }
    
  };

  return CodePeeker;
})();
