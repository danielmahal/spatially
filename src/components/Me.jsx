/** @jsx React.DOM */

'use strict';

var React = require('react')
var User = require('./User')

var Me = React.createClass({
  onMouseDown: function(e) {
    console.log('Me mousedown')
  },

  render: function() {
    return this.transferPropsTo(
      <User className="me" onMouseDown={this.onMouseDown}>Me!</User>
    )
  }
})

module.exports = Me
