/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var Actions = require('../actions')

var Login = React.createClass({

  render: function() {
    return (
      <div className="login">
        <h1>Welcome to Spatially!</h1>
        <p>
          To get started talking, click Anoymous login and read the improved copy ..
        </p>
        <ul>
          <li onClick={Actions.login}>Anonymous</li>
          <li>Facebook</li>
          <li>Google</li>
        </ul>
      </div>
    )
  }
})

module.exports = Login;
