/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var Connection = require('./Connection');
var lodash = require('lodash')

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia

var Connections = React.createClass({
  getInitialState: function() {
    return {}
  },

  componentDidMount: function() {
    navigator.getUserMedia(
      {video: false, audio: true},
      function(stream) {
        this.setState({
          localStream: stream
        });
      }.bind(this),
      console.error.bind(console)
    )
  },

  render: function() {
    var localStream = this.state.localStream;
    var connections = this.props.connections;

    var viewBox = [
      window.innerWidth * -0.5,
      window.innerHeight * -0.5,
      window.innerWidth,
      window.innerHeight
    ].join(' ')

    return this.transferPropsTo(
      <svg className="connections" viewBox={viewBox}>
        {connections
          .filter(function(connection) {
            return localStream || !connection.me
          })
          .map(function(connection) {
            return Connection(lodash.extend(connection, {
              localStream: localStream
            }))
          })
        }
      </svg>
    )
  }
})

module.exports = Connections
