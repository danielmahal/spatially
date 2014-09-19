/** @jsx React.DOM */

'use strict';

var Firebase = require('firebase')
var FirebaseSimpleLogin = require("../lib/FirebaseSimpleLogin")

var React = require('react/addons')
var Auth = require('./Auth')
var Me = require('./Me')
var User = require('./User')
var lodash = require('lodash')

var Application = React.createClass({
  getInitialState: function() {
    var ref = new Firebase('https://spatially.firebaseio.com/')

    return {
      firebase: ref,
      user: null,
      userMeta: null,
      authClient: null
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

      console.log(arguments)
      ref.child('online').child(user.uid).set(true)
      ref.child('online').child(user.uid).onDisconnect().remove()
      ref.child('.info/authenticated').on('value', function(snap) {
        var online = snap.val()
        if (!online)
          ref.child('online').child(user.uid).remove()
      })

      ref.child('users').child(user.uid).on('value', function(snap) {
        var userMeta = snap.val()

        self.setState({userMeta: userMeta})
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

  moveMe: function(position) {
    this.state.firebase.child('users').child(this.state.user.uid).update({
      position: position
    })
  },

  render: function() {
    var user = this.state.user
    var userMeta = this.state.userMeta
    var authClient = this.state.authClient
    var me

    if(userMeta) {
      me = Me(lodash.extend(lodash.clone(userMeta), {
         move: this.moveMe
      }))
    }

    return (
      <div className="application">
        <Auth user={user} userMeta={userMeta} authClient={authClient} />

        <div className="space">
          {me}
          <User position={{ x: 150, y: 50 }}>User</User>
        </div>
      </div>
    )
  }
})

module.exports = Application
