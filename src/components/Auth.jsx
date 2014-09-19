/** @jsx React.DOM */

'use strict';

var React = require('react/addons')

var Auth = React.createClass({
  componentDidMount: function() {
  },

  render: function() {
    var user = this.props.user

    if (user)
      return <div>{user}</div>

    return <div className="user" onClick={this.handleLogin}>Sign in</div>
  },

  handleLogin: function() {
    var authClient = this.props.authClient
    authClient.login('anonymous');
  }
})

module.exports = Auth;
