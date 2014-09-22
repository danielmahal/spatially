/** @jsx React.DOM */

'use strict';

var Firebase = require('firebase')
var FirebaseSimpleLogin = require("../lib/FirebaseSimpleLogin")

var React = require('react/addons')
var Auth = require('./Auth')
var Me = require('./Me')
var User = require('./User')
var Connections = require('./Connections')
var lodash = require('lodash')

var Application = React.createClass({
  getInitialState: function() {
    var ref = new Firebase('https://spatially.firebaseio.com/')

    return {
      firebase: ref,
      users: [],
      user: null,
      userMeta: null,
      authClient: null,
      dragging: false
    }
  },

  componentDidMount: function() {
    var self = this
    var ref = this.state.firebase

    /*
     *  Manage login/online/offline handlers
     */
    var authClient = new FirebaseSimpleLogin(ref, function(err, user) {
      if(!user)
        return

      if (err)
        return console.error(err)

      ref.child('online').child(user.uid).set(true)
      ref.child('online').child(user.uid).onDisconnect().remove()
      ref.child('.info/authenticated').on('value', function(snap) {
        var online = snap.val()
        if (!online)
          ref.child('online').child(user.uid).remove()
      })

      ref.child('users').on('value', function(snap) {
        self.setState({users: snap.val()})
      })

      ref.child('users').child(user.uid).on('value', function(snap) {
        self.setState({userMeta: snap.val()})
      })

      self.setState({user: user})
    })

    // Populate online peeps
    ref.child('online').on('value', function(snap) {
      var currentUsers = snap.val()

      self.setState({currentUsers: currentUsers})
    })

    this.setState({authClient: authClient})
  },

  setDrag: function(toggle) {
    this.setState({
      dragging: toggle
    })
  },

  moveMe: function(position) {
    this.state.firebase.child('users').child(this.state.user.uid).update({
      position: position
    })
  },

  renderMe: function() {
    if(this.state.user) {
      var userMeta = this.state.userMeta
      var props = lodash.extend(lodash.clone(userMeta), {
         move: this.moveMe,
         setDrag: this.setDrag
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
    var userMeta = this.state.userMeta
    var authClient = this.state.authClient
    var me = this.renderMe()
    var others = this.renderOthers()
    var connections = this.renderConnections()

    var classes = {
      space: true,
      dragging: this.state.dragging
    }

    return (
      <div className="application">
        <Auth user={user} userMeta={userMeta} authClient={authClient} />

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
