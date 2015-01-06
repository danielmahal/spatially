/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var Actions = require('../actions')

var Login = React.createClass({

  render: function() {
    return (
      <div className="login">
        <h1>Welcome to Spatially!</h1>

        <button className="login-button facebook" onClick={Actions.login}>Login with Facebook</button>
        <p className="no-worries">Don't worry. We neither store nor share your data. No bullshit.</p>
      </div>
    )
  }
})

module.exports = Login;
