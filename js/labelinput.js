// Labelinput v1.00
// Copyright (c) 2009 Aurélien Geron, Wifirst
// Released under the MIT Licence.


function set_caret_position(input, pos) {
  if (Prototype.Browser.IE) {
    var sel = document.selection.createRange();
    sel.moveStart('character', -input.value.length);
    sel.moveStart('character', pos);
    sel.moveEnd('character', 0);
  } else {
    input.selectionStart = pos;
    input.selectionEnd = pos;
  }
}

function keydown_handler(event) {
  element=Event.element(event);
  if (element.value==element.defaultValue) {
    element.removeClassName('labelinput_empty');
    if (element.hasClassName('labelinput_password')) {
      set_input_type(element,'password');
    }
    element.value='';
  }
  element.removeClassName("required_error");
}

function set_input_type(input, new_type) {
  if (Prototype.Browser.IE) {
    if (true) return input;
    var new_input = document.createElement('input');
    new_input.type = new_type;
    if (input.id)    new_input.id    = input.id;
    if (input.name)  new_input.name  = input.name;
    if (input.className) new_input.className = input.className;
    if (input.size)  new_input.size  = input.size;
    if (input.value) new_input.value = input.value;
    /* if (input.selectionStart) new_input.selectionStart = input.selectionStart;
       if (input.selectionEnd)   new_input.selectionEnd   = input.selectionEnd;   */
    input.parentNode.replaceChild(new_input,input);
    return new_input;
  } else {
    input.type=new_type;
    return input;
  }
}


function focus_handler(event) {
  element=Event.element(event);
  if (element.value==element.defaultValue || element.value=='') {
    element.addClassName('labelinput_empty');
    element.value='';
    if (element.hasClassName('labelinput_password')) {
      set_input_type(element,'text');
    }
    element.value=element.defaultValue;
    set_caret_position(element, 0);
  }
}
 
function blur_handler(event) {
  element=Event.element(event);
  if (element.value==element.defaultValue || element.value=='') {
    element.addClassName('labelinput_empty');
    if (element.hasClassName('labelinput_password')) {
      set_input_type(element, 'text');
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
  forms = $$('form');
  for (i=0; i<forms.length; i++) {
    labelinputs = forms[i].descendants();
    for (j=0; j<labelinputs.length; j++) {
      if (labelinputs[j].hasClassName("labelinput")) {
        forms[i].observe('submit', submit_handler);
        break;
      }
    }
  }
  $$('.labelinput').each(function(element){
    element.actualValue=actualValue.bind(element);
    if (element.type=='password') {
      element.addClassName('labelinput_password');
      element.value=element.defaultValue;
      set_input_type(element,'text');
    } else if (element.value=='' && element.value != element.defaultValue) {
      element.value = element.defaultValue;
    }
    if (element.value==element.defaultValue) {
      element.addClassName('labelinput_empty');
    } else {
      element.removeClassName('labelinput_empty');
    }
  });
  $$('.labelinput').invoke('observe','blur', blur_handler);
  $$('.labelinput').invoke('observe','keydown', keydown_handler);
  $$('.labelinput').invoke('observe','keyup', focus_handler);
  $$('.labelinput').invoke('observe','focus',focus_handler);
  $$('.labelinput').invoke('observe','click',focus_handler);
  $$('.labelinput.autofocus').each(function(element){
    element.focus();
  });
});
 
