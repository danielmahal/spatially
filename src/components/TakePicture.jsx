/** @jsx React.DOM */

var React = require('react/addons')
var Actions = require('../actions')

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

/**
 * Have to be careful not to trigger getUserMedia unless we have to
 */
var TakePicture = React.createClass({
  getInitialState: function() {
    return {
      stream: null,
      streamUrl: null
    }
  },

  componentDidMount: function() {
    var picture = this.props.profilePic

    if (picture)
      return null

    navigator.getUserMedia(
      {video: true, audio: false},
      this.handleStream,
      console.error.bind(console)
    )
  },

  render: function() {
    var picture = this.props.profilePic

    if (picture)
      return null

    var streamUrl = this.state.streamUrl
    return <video onClick={this.handlePicture} autoPlay={true} ref="video" src={streamUrl} />
  },

  handleStream: function(stream) {
    this.setState({
      stream: stream,
      streamUrl: URL.createObjectURL(stream)
    })
    this.refs.video.getDOMNode().play()
  },

  handlePicture: function() {
    var stream = this.state.stream
    var video = this.refs.video.getDOMNode()
    var canvas = document.createElement('canvas')

    canvas.width = 100
    canvas.height = 100
    canvas.getContext('2d')
      .drawImage(video, 0, 0, 100, 100)
    var profilePic = canvas.toDataURL()

    Actions.takePicture(profilePic)

    stream.stop()
  }
})

module.exports = TakePicture
