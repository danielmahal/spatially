/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var ReactFireMixin = require('reactfire')

var Firebase = require('firebase')

var Actions = require('../actions')

var Rtc = require('react-rtc')
var Login = require('./Login')
var Me = require('./Me')
var User = require('./User')
var Connections = require('./Connections')
var Connection = require('./Connection')
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

  getMyConnections: function() {
    var auth = this.state.auth
    var users = this.state.users || {}

    return Object.keys(users).reduce(function(connections, userA) {
      return connections.concat(Object.keys(users)
        .filter(function(userB) {
          return userA > userB && (userA === auth.uid || userB === auth.uid)
        })
        .map(function(userB) {
          var distance = Math.sqrt(
            Math.pow(users[userB].position.y - users[userA].position.y, 2) +
            Math.pow(users[userB].position.x - users[userA].position.x, 2)
          )

          var volume = distance / 300

          return {
            key: userA + userB,
            users: [users[userA], users[userB]],
            distance: volume
          }
        })
        .filter(function(connection) {
          return connection.distance <= 1
        }))
    }, [])
  },

  getOtherConnections: function() {
    var auth = this.state.auth
    var users = this.state.users || {}

    return Object.keys(users).reduce(function(connections, userA) {
      return connections.concat(Object.keys(users)
        .filter(function(userB) {
          return userA > userB && userA !== auth.uid && userB !== auth.uid
        })
        .map(function(userB) {
          var distance = Math.sqrt(
            Math.pow(users[userB].position.y - users[userA].position.y, 2) +
            Math.pow(users[userB].position.x - users[userA].position.x, 2)
          )

          var volume = distance / 300

          return {
            key: userA + userB,
            distance: volume
          }
        })
        .filter(function(connection) {
          return connection.distance <= 1
        }))
    }, [])
  },

  renderMyConnections: function() {
    var connections = this.getMyConnections()

    return connections.map(Connection)
  },

  render: function() {
    var auth = this.state.auth

    if (!auth)
      return <Login />

    var users = this.renderUsers()
    var connections = this.renderMyConnections()
    console.log(connections);

    var classes = {
      space: true,
      dragging: this.state.dragging
    }

    return (
      <div className="application">

        <div className={React.addons.classSet(classes)}>
          <Rtc id={auth.uid} fb={ref.child('rtc')} component={Connections}>
            {connections}
          </Rtc>
          {users}
        </div>
      </div>
    )
  }
})

module.exports = Application
