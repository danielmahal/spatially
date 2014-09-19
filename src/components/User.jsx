/** @jsx React.DOM */

'use strict';

var React = require('react/addons')

var User = React.createClass({
  render: function() {
    var position = this.props.position
    var left = position && position.x + 'px'
    var top = position && position.y + 'px'

    var style = {
      left: left,
      top: top
    }

    return this.transferPropsTo(
      <div style={style} className="user">
        {this.props.children}
      </div>
    )
  }
})

module.exports = User
