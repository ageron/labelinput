// Labelinput v1.01
// Copyright (c) 2009 Aurélien Geron, Wifirst
// Released under the MIT Licence.

var LabelInput = Class.create();

LabelInput.prototype = {
  initialize: function() {
    if (!this.options) this.options={};
    this.className          = this.options["className"] || "labelinput";
    this.setParentDivStyle  = this.options["setParentDivStyle"] || true;
    this.setForElementStyle = this.options["setForElementStyle"] || true;
    this.hideUponFocus      = this.options["hideUponFocus"] || false;
    $$('label.'+this.className).each(function(label){
      this.initLabel(label);
    }.bind(this));
  },
  onKeyDown: function(event) {
    this.hideLabel(Event.element(event).labelinput_label);
  },
  onKeyUp: function(event) {
    element = Event.element(event);
    if (!this.hideUponFocus && element.value=='') {
      this.showLabel(element.labelinput_label);
    }
  },
  onLabelClick: function(event) {
    label = Event.element(event);
    forElement = $(label.htmlFor);
    if (forElement) {
      forElement.focus();
    }
  },
  onFocus: function(event) {
    element = Event.element(event);
    if (this.hideUponFocus) {
      this.hideLabel(element.labelinput_label);
    } else {
      if (element.value=='') { this.showLabel(element.labelinput_label); }
    }
  },
  onChange: function(event) {
    element = Event.element(event);
    if (element.value!='') {
      this.hideLabel(element.labelinput_label);
    } else {
      if (this.hideUponFocus) { this.showLabel(element.labelinput_label); }
    }
  },
  onBlur: function(event) {
    if (element.value!='') {
      this.hideLabel(element.labelinput_label);
    } else {
      this.showLabel(Event.element(event).labelinput_label);
    }
  },
  initLabel: function(label) {
    label.addClassName(this.className+"_active");
    label.observe('click', this.onLabelClick.bind(this));
    this.hideLabel(label);
    if (this.setParentDivStyle) {
      parentDiv = label.up("div");
      if (parentDiv) {
        parentDiv.addClassName(this.className+"_parent");
      }
    }
    forElement = $(label.htmlFor);
    if (forElement) {
      if (this.setForElementStyle) {
        forElement.addClassName(this.className+"_for");
      }
      Object.extend(forElement, {'labelinput_label': label});
      forElement.observe('focus',   this.onFocus.bind(this));
      forElement.observe('blur',    this.onBlur.bind(this));
      forElement.observe('keyup',   this.onKeyUp.bind(this));
      forElement.observe('keydown', this.onKeyDown.bind(this));
      forElement.observe('change',  this.onChange.bind(this));
      forElement.observe('click',   this.onChange.bind(this));
      this.showLabel(label);
    }
  },
  hideLabel:   function(label) {
    label.style.textIndent="-1000px";
  },
  showLabel:   function(label) {
    forElement = $(label.htmlFor);
    if (forElement && forElement.value=='') {
      label.style.textIndent="0px";
    }
  }
}

document.observe("dom:loaded", function() {
  new LabelInput();
});

