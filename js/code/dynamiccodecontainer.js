function DynamicCodeContainer(config) {
  this.container = config.container;
  this.callbacks = config.callbacks || {};
  
  this.code = null;
};

DynamicCodeContainer.prototype.fields = {
  float: {
    pattern : /(-?\d+(\.\d)?)\<\/span\>\<span class="hljs-comment"\>\/\*\s?#(float)(:(\d+(\.\d+)?)(:(-?\d+(\.\d+)?))?(:(-?\d+(\.\d+)?))?)?\*\//g,
    pattern_tpl: /(-?\d+(\.\d)?)\/\*\s?#(float)(:(\d+(\.\d+)?)(:(-?\d+(\.\d+)?))?(:(-?\d+(\.\d+)?))?)?\*\//g, 
    input: function() {
      var match = arguments[0];
      var value = arguments[1];
      var step = arguments[5];
      var min_attr = arguments[8] ? "min=\"" + arguments[8] + "\" " : "";
      var max_attr = arguments[11] ? "max=\"" + arguments[11] + "\" " : "";
      var html = '<input class="float" type="number" step="' + step + '" value="' + value + '" ' + min_attr + '' + max_attr + '/>';

      return html;
      
    },
    selector: 'input.float',
    tpl_var: '%$float%',
    tpl_var_pattern: /%\$float%/gi,

    convertToHTML: function(val) {
      return val;
    },

    convertToScript: function(val) {
      return parseFloat(val);
    },

    validate : function(val) {
      return !isNaN(val);
    }
  },

  color: {
    pattern : /(0x([0-9a-fA-F]{6}))\<\/span\>\<span class="hljs-comment"\>\/\*\s?#(color)\*\//g,
    pattern_tpl: /(0x([0-9a-fA-F]{6}))\/\*\s?#(color)\*\//g,
    input: '<input class="color" type="color" value="#$2" />',
    selector: 'input.color',
    tpl_var: '%$color%',
    tpl_var_pattern: /%\$color%/gi,

    convertToHTML: function(val) {
      return val;
    },

    convertToScript: function(val) {
      val = val.slice(1);
      return eval("0x" + val);
    },

    validate : function(val) {
      return true;
    }
  }
};

DynamicCodeContainer.prototype.trigger = function(task, data) {
  data = data || {};
  data.instance = this;
  
  if(typeof this.callbacks[task] == "undefined")
    return data;

  return this.callbacks[task](data);
};

DynamicCodeContainer.prototype.registerHandlers  = function() {
  var self = this;

  /*********************
   * INPUTFIELD CHANGE *
   *********************/
  var register = function(field) {
    field.addEventListener("change", function() {
      self.trigger("onFieldChange", field);
    });
  };
  for(var type in this.fields) {
    var fields = this.container.querySelectorAll(this.fields[type].selector);
    for(var i = 0; i < fields.length; i++) {
      register(fields[i]);
    }
  }
};


DynamicCodeContainer.prototype.loadNewCode  = function(code) {
  this.code = (' ' + code).slice(1);
  code = this.trigger("onBeforeLoadNewCode", {code: code}).code;
  
  for(var type in this.fields) {
    // Add template variables to original code
    this.code = this.code.replace(this.fields[type].pattern_tpl, this.fields[type].tpl_var);
    // Add input fields to highlighted code
    code = code.replace(this.fields[type].pattern, this.fields[type].input);
  }
  

  code = this.trigger("onBeforeHTMLAppended", {code: code}).code;

  this.container.innerHTML = code;

  this.trigger("onHTMLAppended", {code: code, container: this.container});

  this.registerHandlers();

  return code;
};

DynamicCodeContainer.prototype.prepareCustomCode  = function() {
  var values = this.getValues();
  this.validateValues(values);

  var custom_code = this.code;
  for(var type in this.fields) {
    if(typeof values[type] == 'undefined')
      continue;

    custom_code = this.replaceTemplateValues(custom_code, this.fields[type].tpl_var_pattern , values[type]);
  }

  var pattern_fn_rename = /(\s?function\s+)([a-zA-Z0-9_]+)(.*)/;
  var fn_prefix = '__custom_';
  
  var matches = custom_code.match(pattern_fn_rename);
  custom_code = custom_code.replace(pattern_fn_rename, '$1 ' + fn_prefix + '$2$3');
  eval.call(window, custom_code);

  return window[fn_prefix + matches[2]];
};

DynamicCodeContainer.prototype.replaceTemplateValues  = function(code, pattern, values) {
  var idx = -1;
  var replaced = code.replace(pattern, function(match) {
    return values[++idx];
  });
  
  return replaced;
};

DynamicCodeContainer.prototype.getValues  = function(container) {
  var fields = this.container.getElementsByTagName('input');
  var values = {};

  for(var type in this.fields)
    values[type] = [];

  for(var i in fields) {
    var field = fields[i];
    for(var type in this.fields) {
      if(DOMUtils.hasClass(field, type))
        values[type].push(this.fields[type].convertToScript(field.value));
    }
  }

  return values;
};

DynamicCodeContainer.prototype.validateValues = function(values) {
  for(var type in this.fields) {
    if(typeof values[type] == 'undefined')
      continue;

    for(var k in values[type])
      if(!this.fields[type].validate(values[type][k]))
        throw new Error("Not a " + type)
  }

  return true;
};

DynamicCodeContainer.prototype.toIdentifier  = function(values) {
  var identifier = '';
  
  for(var i in values) {
    for(var k in values[i])
      identifier += i + '-' + k +'_' + values[i][k].toString();
  }
  return identifier;
};
