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

AsyncContent.prototype.loadDefaultContents = function(callback) {
  var containers = document.querySelectorAll("[data-default-content]");
  var num = containers.length;
  var onLoaded = function() {
    if(--num == 0)
      callback();
  };

  for(var i = 0; i < containers.length; i++) {
    var container = containers[i];
    var path = container.getAttribute("data-default-content");
    var target = container.getAttribute("data-async-container");
    this.loadContentInTarget(target, path, onLoaded);
  }
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

AsyncContent.prototype.loadContentInTarget = function(target, path, callback) {
  var self = this;

    document.querySelectorAll("data-async-target").forEach(function(elm) {
      elm.removeAttribute("data-active");
      if(elm.getAttribute("data-sync-target") == target)
        elm.setAttribute("data-active", "1");
    });

  var success = function(request) {
    self.getTargetDom(target).removeAttribute("data-loading");
    self.replaceContent(target, request.result.data);
    if(typeof callback == "function")
      callback();
  };

  var error = function(e) {
    self.getTargetDom(target).removeAttribute("data-loading");
    console.error("ERROR for " + target + " on path" + path);
    if(typeof callback == "function")
      callback();
  };

  self.getTargetDom(target).setAttribute("data-loading", "1");
  ContentLoader.load(path, success, error)
};

AsyncContent.prototype.getTargetDom = function(target_id) {
  return document.querySelector("[data-async-container='" + target_id + "']");
};

AsyncContent.prototype.replaceContent = function(target_id, content) {
  var target_container = this.getTargetDom(target_id);
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