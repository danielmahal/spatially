/** @jsx React.DOM */

'use strict';

var React = require('react/addons')

var User = React.createClass({
  renderImage: function() {
    var image = this.props.profilePic

    if(image) {
      return <img src={image} />
    }
  },

  render: function() {
    var position = this.props.position
    var left = position && position.x + 'px'
    var top = position && position.y + 'px'
    var image = this.renderImage()

    var style = {
      transform: 'translate3d(' + left + ', ' + top + ', 0)'
    }

    return this.transferPropsTo(
      <div style={style} className="user">
        {image}
        {this.props.children}
      </div>
    )
  }
})

module.exports = User
