/** @jsx React.DOM */

'use strict';

var React = require('react/addons')
var Reflux = require('reflux')

var userStore = require('../stores/user')
var usersStore = require('../stores/users')
var Actions = require('../actions')

var Login = require('./Login')
var Me = require('./Me')
var User = require('./User')
var Connections = require('./Connections')
var lodash = require('lodash')

var Application = React.createClass({
  getInitialState: function() {
    return {
      users: [],
      user: {},
      dragging: false
    }
  },

  componentDidMount: function() {

    userStore.listen(function(user) {
      this.setState({user: user})
    }.bind(this))

    usersStore.listen(function(users) {
      this.setState({users: users})
    }.bind(this))
  },

  setDrag: function(toggle) {
    this.setState({
      dragging: toggle
    })
  },

  renderMe: function() {
    if(this.state.user) {
      var user = this.state.user
      var props = lodash.extend(lodash.clone(user), {
         setDrag: this.setDrag,
         position: user.position || {x: 0, y: 0}
      })

      return Me(props)
    }
  },

  renderOthers: function() {
    var user = this.state.user

    var otherUsers = lodash.reject(this.state.users, function(other, uid) {
      return uid === user.uid
    })

    return lodash.map(otherUsers, function(other, key) {
      return User(lodash.extend(other, {
        key: key
      }))
    })
  },

  getConnections: function() {
    var users = lodash.values(this.state.users)

    return lodash.reduce(users, function(connections, a) {
      lodash.forEach(lodash.reject(users, a), function(b) {
        var distance = Math.sqrt(Math.pow(b.position.y - a.position.y, 2) + Math.pow(b.position.x - a.position.x, 2))
        var volume = distance / 300

        if(volume <= 1) {
          connections.push({
            users: [a, b],
            distance: volume
          })
        }
      })

      return connections
    }, [], this)
  },

  renderConnections: function() {
    var connections = this.getConnections()

    return <Connections connections={connections} />
  },

  render: function() {
    var user = this.state.user
    var me = this.renderMe()
    var others = this.renderOthers()
    var connections = this.renderConnections()

    var classes = {
      space: true,
      dragging: this.state.dragging
    }

    if (!user.uid)
      return <Login />

    return (
      <div className="application">

        <div className={React.addons.classSet(classes)}>
          {connections}
          {me}
          {others}
        </div>
      </div>
    )
  }
})

module.exports = Application
