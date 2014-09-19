/** @jsx React.DOM */

'use strict';

var React = require('react/addons')

var Auth = React.createClass({
  render: function() {
    var user = this.props.user

    if (user)
      return <div>Authenticated</div>

    return <div className="auth" onClick={this.handleLogin}>Sign in</div>
  },

  handleLogin: function() {
    var authClient = this.props.authClient
    authClient.login('anonymous');
  }
})

module.exports = Auth;
