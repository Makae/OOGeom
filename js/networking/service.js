function Service(max_procesing) {
  this.max_processing = 5;
  this.queue = [];
  this.processing = [];
};

Service.prototype.init = function() {

};

Service.prototype.request = function(config) {
  var request = new Request(config);
  this.enqueue(request);
  return request;
};

Service.prototype.enqueue = function(request) {
  this.queue.push(request);
  this._next_request();
};

Service.prototype._next_request = function() {
  if(!this.queue.length) {
    return;
  } else if (this.processing.length >= this.max_processing) {
    //console.warn("Too many open requests. Queue-Length:" + this.queue.length);
    return;
  }
  var request = this.queue.shift();
  //console.info("NEXT REQUEST :" + request.identifier);
  this._exec_request(request);
};

Service.prototype._exec_request = function(request) {
  this._decorate_request(request);
  this.processing.push(request);
  request.execute();

},

Service.prototype._decorate_request = function(request) {
  var self = this;
  var _success = request.success;
  var _error = request.error;

  request.success = function(request, e) {
    _success(request, e);
    self.trash(request);
    self._next_request();
  };

  request.error = function(request, e) {
    _error(request, e);
    self.trash(request);
    self._next_request();
  };
};

Service.prototype.trash  = function(request) {
  //console.log("Trashing Request:" + request.identifier);
  for(var k in this.processing) {
    if(this.processing[k].identifier == request.identifier) {
      this.processing.splice(k, 1);
      return;
    }
  }

  for(var k in this.queue) {
    if(this.queue[k].identifier == request.identifier) {
      this.queue.splice(k, 1);
      return;
    }
  };
};