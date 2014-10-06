/** @jsx React.DOM */

'use strict';

var React = require('react/addons')

var Connection = React.createClass({

  componentWillReceiveProps: function(newProps) {
    if (this.props.remoteStream !== newProps.remoteStream) {
      var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      var source = audioCtx.createMediaStreamSource(newProps.remoteStream)
      var gainNode = audioCtx.createGain()
      source.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      console.log('making sound!', audioCtx.destination, newProps.remoteStream);
      var elem = document.createElement('audio')
      elem.src = URL.createObjectURL(newProps.remoteStream)
      elem.setAttribute('autoPlay', true)
      elem.setAttribute('mute', true)

      this.setState({'node': gainNode})
    }
  },

  render: function() {
    var users = this.props.users
    var distance = this.props.distance

    if (this.state && this.state.node)
      this.state.node.value = 1 - distance
    console.log(distance)

    var a = users[0]
    var b = users[1]
    var path = ['M', a.position.x, a.position.y, 'L', b.position.x, b.position.y].join(' ')
    var strokeWidth = (1 - distance) * 5
    // var style = { opacity: 1 - distance }

    return <path stroke="white" strokeWidth={strokeWidth} d={path} />
  }
})

module.exports = Connection
