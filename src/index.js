'use strict';

require('./styles/index.styl')

var React = require('react')
var Application = require('./components/Application')

window.addEventListener('load', function() {
  React.renderComponent(Application(), document.body)
})