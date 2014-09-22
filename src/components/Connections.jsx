/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var lodash = require('lodash')

var User = React.createClass({
  renderConnection: function(connection) {
    var a = connection.users[0]
    var b = connection.users[1]
    var path = ['M', a.position.x, a.position.y, 'L', b.position.x, b.position.y].join(' ')
    var strokeWidth = (1 - connection.distance) * 5
    // var style = { opacity: 1 - connection.distance }

    return <path stroke="white" strokeWidth={strokeWidth} d={path} />
  },

  render: function() {
    var viewBox = [
      window.innerWidth * -0.5,
      window.innerHeight * -0.5,
      window.innerWidth,
      window.innerHeight
    ].join(' ')

    var connections = lodash.map(this.props.connections, this.renderConnection)

    return this.transferPropsTo(
      <svg className="connections" viewBox={viewBox}>
        {connections}
      </svg>
    )
  }
})

module.exports = User
