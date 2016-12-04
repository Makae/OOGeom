var ContentLoader = (function() {
  var instance;

  var ContentLoader = function() {
    if(instance)
      return instance;

    this.base = '';
    this.service = new Service(5);
  }

  ContentLoader.prototype.setBase = function(base) {
    this.base = base;
    return this;
  }

  ContentLoader.prototype.load = function(element, success, error) {
    var elm_path = this.base + element;
    return this.service.request({
      url: elm_path,
      method: 'GET',
      data : {},
      success: success,
      error: error
    });
  };

  return new ContentLoader;
})();
