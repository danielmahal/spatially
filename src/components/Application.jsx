/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var ReactFireMixin = require('reactfire')

var Firebase = require('firebase')

var Actions = require('../actions')

var Login = require('./Login')
var Me = require('./Me')
var User = require('./User')
var Connections = require('./Connections')
var lodash = require('lodash')

var ref = new Firebase('https://spatially.firebaseio.com')
window.ref = ref

var Application = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      users: {},
      auth: ref.getAuth(),
      dragging: false
    }
  },

  componentWillMount: function() {
    var userRef = ref.child('users')

    this.bindAsObject(userRef, 'users')

    ref.onAuth(function(auth) {
      if (auth) {
        userRef.child(auth.uid).set({
          facebookId: auth.facebook.id,
          position: {x: 0, y: 0}
        })

        userRef.child(auth.uid).onDisconnect().remove()
      }

      if (!auth && this.state.auth)
        userRef.child(this.state.auth.uid).remove()

      this.setState({auth: auth})
    }.bind(this))
  },

  setDrag: function(toggle) {
    this.setState({
      dragging: toggle
    })
  },

  renderUsers: function() {
    var auth = this.state.auth
    var users = this.state.users || {}

    return lodash.map(users, function(user, uid) {
      var props = lodash.extend(user, {
        key: uid
      })

      if (uid === auth.uid)
        return Me(lodash.extend(props, {
          setDrag: this.setDrag,
          position: user.position || {x: 0, y: 0}
        }))

      return User(props)
    }.bind(this))
  },

  renderConnections: function() {
    var auth = this.state.auth
    var users = this.state.users || {}

    return Object.keys(users).reduce(function(connections, userA) {
      return connections.concat(Object.keys(users)
        .filter(function(userB) {
          // only one connection per pair
          return userA > userB
        })
        .map(function(userB) {
          var distance = Math.sqrt(
            Math.pow(users[userB].position.y - users[userA].position.y, 2) +
            Math.pow(users[userB].position.x - users[userA].position.x, 2)
          )

          return {
            key: userA + userB,
            users: [users[userA], users[userB]],
            distance: distance,
            me: userA === auth.uid || userB === auth.uid
          }
        })
        .filter(function(connection) {
          return connection.distance / 400 <= 1
        }))
    }, [])
  },

  logout: function() {
    Actions.logout()
  },

  render: function() {
    var auth = this.state.auth

    if (!auth)
      return <Login />

    var users = this.renderUsers()
    var connections = this.renderConnections()

    var classes = {
      space: true,
      dragging: this.state.dragging
    }

    return (
      <div className="application">
        <div className={React.addons.classSet(classes)}>
          <Connections connections={connections} />
          {users}
        </div>

        <menu className="menu">
          <button className="logout" onClick={this.logout}>Log out</button>
        </menu>
      </div>
    )
  }
})

module.exports = Application
