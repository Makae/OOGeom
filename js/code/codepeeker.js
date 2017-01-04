var CodePeeker = (function(){
  var counter = 0;

  function CodePeeker(config) {
    this.config = config;
    this.codelinks = config.codelinks;
    this.container = config.container;

    this.prepareCode(this.container, config.custom_codelinks || []);
    this.registerHandlers(this.container);
  };

  CodePeeker.prototype.trigger = function(task, data) {
    data = data || {};
    data.instance = this;
    
    if(typeof this.callbacks[task] == "undefined")
      return data;

    return this.callbacks[task](data);
  };

  CodePeeker.prototype.prepareCode = function(element, custom_codelinks) {
    var code = element.innerHTML;

    custom_codelinks = custom_codelinks || [];
    for(var i = 0; i < this.codelinks.length; i++)
      custom_codelinks.push(this.codelinks[i]);
    


    for(var i = 0; i < custom_codelinks.length; i++) {
      var cl = custom_codelinks[i];
      
      for(var n = 0; n < cl.patterns.length; n++) {
        var pattern = cl.patterns[n]; 

        code = code.replace(pattern, cl.replace);
      }
    }
    element.innerHTML = code;
  }

  CodePeeker.prototype.peekCode = function(element) {
    var identifier = element.getAttribute("data-codepeeker-fn");
    var idx = element.getAttribute("data-codepeeker-id");
    var dimensions = this.getPeekDimension(element);

    this.showPeek(idx, dimensions, identifier); 
  };

  CodePeeker.prototype.getPeekDimension = function(element) {
    var rect = element.getBoundingClientRect();
    var width = this.config.width;
    var height = this.config.height;
    var left = rect.left;
    var top = rect.top + rect.height + this.calcScrollOffset();
    
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

  CodePeeker.prototype.calcScrollOffset = function(element) {
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return scrollTop;
  }

  CodePeeker.prototype.hidePeek = function(idx) {
    var elm = document.querySelector("[data-codepeeker-idx='" + idx + "']");
    if(elm)
      elm.parentElement.removeChild(elm);
  };

  CodePeeker.prototype.hidePeekById = function(identifier) {
    var elm = document.querySelector("[data-codepeeker-id='" + identifier + "']");
    if(elm)
      elm.parentElement.removeChild(elm);
  }

  CodePeeker.prototype.hidePeeks = function() {
    var elements = document.querySelectorAll("div.codepeek-wrapper");
    for(var i = 0; i < elements.length; i++)
      this.hidePeek(elements[i].getAttribute("data-codepeeker-idx"));
  };

  CodePeeker.prototype.showPeek = function(idx, dimensions, identifier) {
    this.hidePeekById(identifier);
    var self = this;

    var custom_codelinks = [];
    if(identifier.match(/[A-Za-z0-9_]+\.prototype\./)) {
      var this_link = identifier.replace(/\.prototype\..*/, ".prototype");
      custom_codelinks.push({
                'id' : 'this-links',
                'replace' : '<span data-codepeeker-fn="' + this_link + '.$2">$1$2</span>(',
                'patterns' : [
                    /(\<span[^\>]+\>this\<\/span\>\.)([a-zA-Z0-9_]+)\(/gi,
                ]
            });
      }

    var code = this.loadCode(identifier);
    code = codehighlighter.highlightCode(code);
    code = codehighlighter.prepareCode(code);

    var style = 'position:absolute; top: ' + dimensions.top + 'px; left:' + dimensions.left + 'px; max-width:' + dimensions.width + 'px; max-height:' + dimensions.height + 'px';
    var html = 
      '<div class="codepeek-wrapper" style="' + style + '" data-codepeeker-idx="' + idx + '" data-codepeeker-id="' + identifier + '">' +
        '<span class="glyphicon glyphicon-remove close"></span>' +
        '<code class="codepeeker javascript" style="max-width:' + dimensions.width + 'px;">' + code + '</code>' +
      '</div>';
    var wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    document.querySelector("body").appendChild(wrapper.querySelector("div.codepeek-wrapper"));
    
    var cp_wrapper_elm =  document.querySelector("[data-codepeeker-idx='" + idx + "']");
    var code_elm = cp_wrapper_elm.querySelector("code");

    var cfg = {
      'custom_codelinks' : custom_codelinks
    };
    codehighlighter.addCodePeeker(code_elm, undefined, cfg);
    
    code_elm.className += " hljs";

    cp_wrapper_elm.style.height = code_elm.offsetHeight + "px";
    cp_wrapper_elm.style.width = code_elm.offsetWidth + "px";
    code_elm.style.width = code_elm.offsetWidth + "px";
    

    cp_wrapper_elm.querySelector(".close").addEventListener("click", function() {
      var idx = this.parentElement.getAttribute("data-codepeeker-idx");
      self.hidePeek(idx);
    });


  };

  CodePeeker.prototype.loadCode = function(identifier) {
    var elms = identifier.split(".");
    var ref = window;
    for(var i = 0; i < elms.length; i++){
      ref = ref[elms[i]];
    }

    var code = ref.toString();
    code = code.replace("function (", "function " + identifier + "(")

    return code;
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
