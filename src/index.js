'use strict';

require('./styles/index.styl')

var React = require('react')
var Application = require('./components/Application')

React.initializeTouchEvents(true)

window.React = React

window.addEventListener('load', function() {
  React.renderComponent(Application(), document.body)
})
