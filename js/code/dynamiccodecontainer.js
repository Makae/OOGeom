function DynamicCodeContainer(config) {
  this.container = config.container;
  this.code = null;
};

DynamicCodeContainer.prototype.fields = {
  float: {
    pattern : /(-?\d+(\.\d)?)\/\*\s?#(float)\*\//g,
    input: '<input class="float" type="number" step="0.1" value="$1" />',
    tpl_var: '%$float%',
    tpl_var_pattern: /%\$float%/gi,

    convertToHTML: function(val) {
      return val;
    },

    convertToScript: function(val) {
      return val;
    },

    validate : function(val) {
      return !isNaN(val)
    }
  },
  color: {
    pattern : /(0x([0-9a-fA-F]{6}))\/\*\s?#(color)\*\//g,
    input: '<input class="color" type="color" value="#$2" />',
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
      return true
    }
  }
};


DynamicCodeContainer.prototype.loadNewCode  = function(code) {
    this.code = (' ' + code).slice(1);

    for(var type in this.fields)
      this.code = this.code.replace(this.fields[type].pattern, this.fields.color.tpl_var);
    
    var code = code.replace(this.fields.float.pattern, this.fields.float.input);
    code = code.replace(this.fields.color.pattern, this.fields.color.input);

    code = code.replace(new RegExp("\n", 'g'), "<br />\n");
    // Replace single slash comments with slash star comments
    code = code.replace(/^([^\/])*\/\/(.*)$/g, '$1\/\* $2 \*\/');
    code = code.replace(/\s*(\s{2})/g, '<span class="space">$1</span>')

    this.container.textContent = code;
    return code;
};

DynamicCodeContainer.prototype.prepareCustomCode  = function() {
  var values = this.getValues();
  this.validateValues(values);

  task = this.code;
  for(var type in this.fields) {
    if(typeof values[type] == 'undefined')
      continue;
    task = this.replaceTemplateValues(task, this.fields[type].tpl_var_pattern , values[type]);
  }

  var pattern_fn_rename = /(\s?function\s+)([a-zA-Z0-9_]+)(.*)/;
  var fn_prefix = '__custom_';
  
  var matches = task.match(pattern_fn_rename);
  task = task.replace(pattern_fn_rename, '$1 ' + fn_prefix + '$2$3');
  eval.call(window, task);

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
  var fields = container.getElementsByTagName('input');
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
