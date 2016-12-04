var AsyncContent = function(config) {
  this.container = config.container;
  this.callbacks = config.callbacks || {};
};

AsyncContent.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return data;

  return this.callbacks[task](data);
};

AsyncContent.prototype.registerLinks = function() {
  var links = document.querySelectorAll("[data-async-target]");
  for(var i = 0; i < links.length; i++) {
    if(links[i].getAttribute("data-async-registered"))
      continue;
    this.registerHandler(links[i]);
  }
};

AsyncContent.prototype.registerHandler = function(link) {
  var self = this;
  var onclick = function(e) {

    var content_path = self.determineContentPath(this);
    var target = this.getAttribute("data-async-target");

    self.loadContentInTarget(target, content_path);
  };

  link.addEventListener("click", onclick);
  link.setAttribute("data-async-registered", "1");
};

AsyncContent.prototype.determineContentPath = function(elm) {
  if(elm.hasAttribute("data-async-content-path"))
    return elm.getAttribute("data-async-content-path");
  if(elm.hasAttribute("href"))
    return elm.getAttribute("href").split('#')[1];
  if(elm.hasAttribute("src"))
    return elm.getAttribute("src");
};  

AsyncContent.prototype.loadContentInTarget = function(target, path) {
  var self = this;
  var success = function(request) {
    self.replaceContent(target, request.result.data)
  };

  var error = function(e) {
    console.error("ERROR for " + target + " on path" + path);
  };

  ContentLoader.load(path, success, error)
};

AsyncContent.prototype.replaceContent = function(target_id, content) {
  var target_container = document.querySelector("[data-async-container='" + target_id + "']");

  var data = this.trigger("onBeforeReplaceContent", {
    content: content, 
    target_id: target_id,
    target: target_container
  });

  content = data.content
  target_container.innerHTML = content;
  data = this.trigger("onAfterReplaceContent", {
    content: content, 
    target_id: target_id, 
    target: target_container
  })
};