// Labelinput v1.00
// Copyright (c) 2009 Aurélien Geron, Wifirst
// Released under the MIT Licence.

function goto_start(input) {
  if (Prototype.Browser.IE) {
    range = input.createTextRange();
    range.collapse(true);
    range.select();
  } else {
    input.selectionStart = 0;
    input.selectionEnd = 0;
  }
}

function keydown_handler(event) {
  element=Event.element(event);
  element.removeClassName("required_error");
  if (element._set_type_ok) {
    element = hide_default(element);
  }
}

function hide_default(element) {
  if (element.value==element.defaultValue || element.value=='') {
    element.removeClassName('labelinput_empty');
    if (element.hasClassName('labelinput_password')) {
      element = set_input_type(element, 'password', true);
    }
    element.value='';
    return element;
  }
}

function show_default(element, gostart) {
  if (element.value==element.defaultValue || element.value=='') {
    element.value='';
    element.addClassName('labelinput_empty');
    element.removeClassName("required_error");
    if (element.hasClassName('labelinput_password')) {
      element = set_input_type(element, 'text', true);
    }
    element.value = element.defaultValue;
    if (gostart) { goto_start(element); }
  }
}
 
function set_input_type(input, type, add_observers) {
  if (input.type==type) { return input; }
  try {
    input.type = type;
    return input;
  }
  catch (ex) {
    input.hide();
    if (type=="text") {
      label = $(input.id+"__label");
      label.show();
      return label;
    } else {
      inputid=input.id.substring(0, input.id.length-7);
      pwd = $(inputid);
      pwd.show();
      pwd.focus();
      return pwd;
    }
  }
}

function add_input_observers(input) {
  Event.observe(input, 'blur',    blur_handler);
  Event.observe(input, 'focus',   focus_handler);
  Event.observe(input, 'keydown', keydown_handler);
  Event.observe(input, 'keyup',   focus_handler);
  Event.observe(input, 'click',   focus_handler);
}


function focus_handler(event) {
  element=Event.element(event);
  if (element._set_type_ok) {
    show_default(element, true);
  } else {
    hide_default(element);
  }
}

function blur_handler(event) {
  element=Event.element(event);
  show_default(element, false);
}

function submit_handler(event) {
  element = Event.element(event);
  labelinputs = element.descendants();
  first_error_label=null;
  for (i=0; i<labelinputs.length; i++) {
    if (labelinputs[i].hasClassName("labelinput")) {
      if (labelinputs[i].hasClassName('required') && (labelinputs[i].value=='' || labelinputs[i].value==labelinputs[i].defaultValue)) {
        labelinputs[i].addClassName("required_error");
        if (first_error_label==null) first_error_label=labelinputs[i];
      }
    }
  }
  if (first_error_label != null) {
    first_error_label.focus();
    Event.stop(event);
    return;
  }
  for (i=0; i<labelinputs.length; i++) {
    if (labelinputs[i].hasClassName("labelinput")) {
      if (labelinputs[i].value==labelinputs[i].defaultValue) {
        labelinputs[i].value='';
      }
    }
  }
}

function actualValue() {
  if (this.value==this.defaultValue) { return ""; } else { return this.value; }
}

Event.observe(window,'load',function() {
  forms = $A(document.forms).each(function(form) {
    Event.observe(form, 'submit', submit_handler);
  });
  $$('.labelinput').each(function(element){
    Object.extend(element, {"_set_type_ok": true });
    if (element.type=='password') {
      element.addClassName('labelinput_password');
      try {
        element.type="text";
        element.actualValue=actualValue.bind(element);
      }
      catch(ex) {
        Object.extend(element, {"_set_type_ok": false });
        new_input = $( document.createElement("input") );
        new_input.type = "text";
        new_input.id = element.id+"__label";
        new_input.name = element.name+"__label";
        new_input.value = element.value;
        new_input.defaultValue = element.defaultValue;
        new_input.value=element.defaultValue;
        new_input.addClassName(element.classNames());
        element.parentNode.insertBefore(new_input, element);
        add_input_observers(element);
        element.actualValue=function(){return this.value;}.bind(element);
        new_input.actualValue=function(){return this.value;}.bind(element);
        element.value='';
        element.hide();
        element=new_input;
      }
    } else if (element.value=='' && element.value != element.defaultValue) {
      element.value = element.defaultValue;
    }
    if (element.value==element.defaultValue) {
      element.addClassName('labelinput_empty');
    } else {
      element.removeClassName('labelinput_empty');
    }
    add_input_observers(element);
  });
  $$('.labelinput.autofocus').each(function(element){
    element.focus();
  });
});
 
