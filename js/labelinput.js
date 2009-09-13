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
  if (element.value==element.defaultValue) {
    element.removeClassName('labelinput_empty');
    if (element.hasClassName('labelinput_password')) {
      element = set_input_type(element,'password', true);
    }
    element.value='';
  }
  element.removeClassName("required_error");
}

function set_input_type(input, type, add_observers) {
  try {
    input.type = type;
    return input;
  }
  catch (ex) {
    var new_input = document.createElement("input");
    new_input.type = type;
    new_input.defaultValue = input.defaultValue;
    for (prop in input) {
      try {
        if (prop != "type" && prop != "height" && prop != "width") { 
          new_input[prop] = input[prop];
        }
      } 
      catch(exc) {}
    }
    if (add_observers) { add_input_observers(new_input); }
    input.parentNode.replaceChild(new_input, input);
    return new_input;
  }
}

function add_input_observers(input) {
  Event.observe(input, 'blur',    blur_handler);
  Event.observe(input, 'keydown', keydown_handler);
  Event.observe(input, 'keyup',   focus_handler);
  Event.observe(input, 'focus',   focus_handler);
  Event.observe(input, 'click',   focus_handler);
}

function focus_handler(event) {
  element=Event.element(event);

  if (element.value==element.defaultValue || element.value=='') {
    element.addClassName('labelinput_empty');
    element.value='';
    if (element.hasClassName('labelinput_password')) {
      element = set_input_type(element,'text', true);
    }
    element.value=element.defaultValue;
    goto_start(element);
  }
}
 
function blur_handler(event) {
  element=Event.element(event);
  if (element.value==element.defaultValue || element.value=='') {
    element.addClassName('labelinput_empty');
    if (element.hasClassName('labelinput_password')) {
      element = set_input_type(element, 'text', true);
    }
    element.value=element.defaultValue;
  }
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
    form.observe('submit', submit_handler);
  });
  $$('.labelinput').each(function(element){
    element.actualValue=actualValue.bind(element);
    if (element.type=='password') {
      element.addClassName('labelinput_password');
      element.value=element.defaultValue;
      element = set_input_type(element,'text', false);
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
 
