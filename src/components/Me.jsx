/** @jsx React.DOM */

'use strict';

var React = require('react')
var User = require('./User')

var Me = React.createClass({
  onMouseDown: function(e) {
    e.preventDefault()

    var node = this.getDOMNode()

    this.startOffset = {
      x: e.clientX - node.offsetLeft,
      y: e.clientY - node.offsetTop
    }

    this.bindDragEvents()
  },

  onMouseMove: function(e) {
    e.preventDefault()

    this.props.move({
      x: e.clientX - this.startOffset.x,
      y: e.clientY - this.startOffset.y
    })
  },

  onMouseUp: function() {
    this.unbindDragEvents()
  },

  componentWillUnmount: function() {
    this.unbindDragEvents()
  },

  bindDragEvents: function() {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },

  unbindDragEvents: function() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },

  render: function() {
    return this.transferPropsTo(
      <User className="me" position={this.props.position} onMouseDown={this.onMouseDown}>Me!</User>
    )
  }
})

module.exports = Me
