/** @jsx React.DOM */

'use strict';

var React = require('react')
var Actions = require('../actions')
var User = require('./User')

var Me = React.createClass({
  getInput: function(e) {
    return 'ontouchstart' in window ? e.changedTouches[0] : e
  },

  dragStart: function(e) {
    var input = this.getInput(e)

    var position = this.props.position || { x: 0, y: 0 }

    this.startOffset = {
      x: input.clientX - position.x,
      y: input.clientY - position.y
    }

    this.bindDragEvents()
    this.props.setDrag(true)
  },

  dragMove: function(e) {
    e.preventDefault()

    var input = this.getInput(e)

    Actions.move({
      x: input.clientX - this.startOffset.x,
      y: input.clientY - this.startOffset.y
    })
  },

  dragEnd: function() {
    this.unbindDragEvents()
    this.props.setDrag(false)
  },

  componentWillUnmount: function() {
    this.unbindDragEvents()
  },

  bindDragEvents: function() {
    document.addEventListener('mousemove', this.dragMove)
    document.addEventListener('mouseup', this.dragEnd)
    document.addEventListener('touchmove', this.dragMove)
    document.addEventListener('touchend', this.dragEnd)
  },

  unbindDragEvents: function() {
    document.removeEventListener('mousemove', this.dragMove)
    document.removeEventListener('mouseup', this.dragEnd)
    document.removeEventListener('touchmove', this.dragMove)
    document.removeEventListener('touchend', this.dragEnd)
  },

  render: function() {
    return this.transferPropsTo(
      <User className="me" position={this.props.position} onMouseDown={this.dragStart} onTouchStart={this.dragStart} />
    )
  }
})

module.exports = Me
