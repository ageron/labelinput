// LabelInput v1.01
// Copyright (c) 2009 Aurélien Geron, Wifirst
// Released under the MIT Licence.

var RequiredInput = Class.create();

RequiredInput.prototype = {
  initialize: function() {
    if (!this.options) this.options={};
    this.className = this.options["className"] || "requiredinput";
    $$('input.'+this.className+',textarea.'+this.className).each(function(element){
      this.initElement(element);
    }.bind(this));
    $$('form').each(function(form){
      this.initForm(form);
    }.bind(this));
  },
  onChange: function(event) {
    Event.element(event).removeClassName(this.className+"_error");
  },
  onSubmit: function(event) {
    firstError=null;
    Event.element(event).select('.'+this.className).each(function(element){
      if (element.value=='') {
        element.addClassName(this.className+'_error');
        if (!firstError) {
          firstError = element;
        }
      }
    }.bind(this));
    if (firstError) {
      firstError.focus();
      Event.stop(event);
    }
  },
  initElement: function(element) {
    element.observe('change',  this.onChange.bind(this));
    element.observe('keydown', this.onChange.bind(this));
  },
  initForm: function(form) {
    form.observe('submit',  this.onSubmit.bind(this));
  }
};

document.observe("dom:loaded", function() {
  new RequiredInput();
});

