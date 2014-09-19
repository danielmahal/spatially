/** @jsx React.DOM */

'use strict';

var Firebase = require('firebase')
var FirebaseSimpleLogin = require("../lib/FirebaseSimpleLogin")

var React = require('react/addons')
var Auth = require('./auth')

var Application = React.createClass({
  getInitialState: function() {
    var self = this
    var ref = new Firebase('https://spatially.firebaseio.com/')

    return {
      firebase: ref,
      user: null,
      authClient: null
    }
  },

  componentDidMount: function() {
    var self = this
    var ref = this.state.firebase

    // Manage login/online/offline handlers
    var authClient = new FirebaseSimpleLogin(ref, function(err, user) {
      if (err)
        return console.error(err)

      console.log(arguments)
      ref.child('online').child(user.uid).set(true)
      ref.child('online').child(user.uid).onDisconnect().remove()
      ref.child('.info/authenticated').on('value', function(snap) {
        var online = snap.val()
        if (!online)
          ref.child('online').child(user.uid).remove()
      })

      ref.child('users').child(user.uid).set({})
      self.setState({user: user})
    })

    // Populate online peeps
    ref.child('online').on('value', function(snap) {
      var currentUsers = snap.val()

      self.setState({currentUsers: currentUsers})
    })

    this.setState({authClient: authClient})
  },

  render: function() {
    var user = this.state.user
    var authClient = this.state.authClient
    return <Auth user={user} authClient={authClient} />
  }
})

module.exports = Application
