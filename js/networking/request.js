function Request(config) {
  this.identifier = Request.prototype.counter++;
  this.url = config.url;
  this.data = config.data || null;
  this.success = config.success || function(){};
  this.error = config.error || config.success;
  this.method = config.method || Request.METHODS.GET;
  this.async = config.async || true;

  this.xmlhttp = null;
  this.result = null;
};

Request.prototype.counter = 0;

Request.prototype.METHODS = {
  GET: 'GET',
  POST: 'POST'
}

Request.prototype.STATUS = {
  ERROR: 0,
  SUCCESS: 1,
  UNKNOWN: 2
}

Request.prototype.execute = function() {
  var self = this;
  var query = [];
  var request_url = this.url;

  for(var key in this.data)
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.data[key]));

  query = (query.length ? query.join('&') : '');
  if(this.method == Request.prototype.METHODS.GET) {
    request_url += (query.length ? '?' : '') + query;
  }


  if(window.XMLHttpRequest)
      this.xmlhttp = new XMLHttpRequest();
  else
      this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

  this.xmlhttp.onreadystatechange = function(e) {
      self._state_change(e);
  };

  this.xmlhttp.open(this.method, request_url, this.async);
  if(this.method == Request.prototype.METHODS.POST)
    this.xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  this.xmlhttp.send(query);
};


Request.prototype._state_change = function(e) {
  if(this.xmlhttp.readyState == XMLHttpRequest.DONE) {
    this.result = {status : Request.prototype.STATUS.UNKNOWN,
                   event : e,
                   data: this.xmlhttp.responseText};
    if(this.xmlhttp.status == 400) {
      this.result.status = Request.prototype.STATUS.ERROR;
      this.error(this, e);
    } else if(this.xmlhttp.status == 200) {
      this.result.status = Request.prototype.STATUS.SUCCESS
      this.success(this, e);
    } else {
      this.error(this, e);
    }
  }
};