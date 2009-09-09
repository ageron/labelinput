// Labelinput v1.00
// Copyright (c) 2009 Aurélien Geron, Wifirst
// Released under the MIT Licence.


function setCaretPosition(input, pos) {
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
      element.type='password';
    }
    element.value='';
  }
  element.removeClassName("required_error");
}

function focus_handler(event) {
  element=Event.element(event);
  if (element.value==element.defaultValue || element.value=='') {
    element.addClassName('labelinput_empty');
    element.value='';
    if (element.hasClassName('labelinput_password')) {
      element.type='text';
    }
    element.value=element.defaultValue;
    setCaretPosition(element, 0);
  }
}
 
function blur_handler(event) {
  element=Event.element(event);
  if (element.value==element.defaultValue || element.value=='') {
    element.addClassName('labelinput_empty');
    if (element.hasClassName('labelinput_password')) {
      element.type='text';
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
    if (element.type=='password') {
      element.addClassName('labelinput_password');
      element.value=element.defaultValue;
      element.type='text';
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
 
