/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var Actions = require('../actions')

var Login = React.createClass({

  render: function() {
    return (
      <div className="login">
        <h1>Welcome to Spatially!</h1>
        <p>Please login using Facebook. No worries, we only use your facebook account as authentication and for your name and picture.</p>
        <button className="login-button facebook" onClick={Actions.login}>Login with Facebook</button>
      </div>
    )
  }
})

module.exports = Login;
