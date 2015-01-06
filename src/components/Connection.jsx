/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var rtc = require('../rtc');

// TODO: Move data into stores.
var ref = new Firebase('https://spatially.firebaseio.com/rtc')

var Connection = React.createClass({

  getInitialState: function() {
    return {}
  },

  /*componentWillReceiveProps: function(newProps) {
    if (this.props.remoteStream !== newProps.remoteStream) {
      // Hacky while experimenting!
      // Setup
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      var source = audioCtx.createMediaStreamSource(newProps.remoteStream)
      var gainNode = audioCtx.createGain()
      var destination = audioCtx.createMediaStreamDestination()

      // Connections
      source.connect(gainNode)
      gainNode.connect(destination)

      // Remove default track and add the manipulated one
      newProps.remoteStream.addTrack(destination.stream.getAudioTracks()[0])
      newProps.remoteStream.removeTrack(newProps.remoteStream.getAudioTracks()[0])

      // Play the stream through the browser!
      var elem = document.createElement('audio')
      elem.src = URL.createObjectURL(newProps.remoteStream)
      elem.setAttribute('autoPlay', true)

      console.log('making sound!', audioCtx.destination, newProps.remoteStream);
      this.setState({node: gainNode})
    }
  },*/

  componentDidMount: function() {
    if (!this.props.me || !this.props.localStream)
      return;

    var key = this.props.key
    var localStream = this.props.localStream

    var connection = rtc(ref.child(key), localStream, function(err, remoteStream) {
      if (err)
        return console.error(err)

      var elem = document.createElement('audio')
      elem.src = URL.createObjectURL(remoteStream)
      elem.setAttribute('autoPlay', true)
      console.log(elem);

      this.setState({
        remoteStream: remoteStream
      })
    }.bind(this))

    this.setState({
      connection: connection
    })
  },

  componentWillUnmount: function() {
    if (this.state.connection)
      this.state.connection.close();
  },

  render: function() {
    var users = this.props.users
    var normalizedDistance = this.props.distance / 400

    if (this.state && this.state.node) {
      this.state.node.value = 1 - normalizedDistance
    }

    var a = users[0]
    var b = users[1]
    var path = ['M', a.position.x, a.position.y, 'L', b.position.x, b.position.y].join(' ')
    var strokeWidth = (1 - normalizedDistance) * 5
    // var style = { opacity: 1 - distance }

    return <path stroke="white" strokeWidth={strokeWidth} d={path} />
  }
})

module.exports = Connection
