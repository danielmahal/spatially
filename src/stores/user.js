var React = require('react/addons')
var Reflux = require('reflux')
var Actions = require('../actions')
var Fb = require('../firebase')

var update = React.addons.update

/**
 * Merges data from the firebase auth obj and the specific user obj
 * Important there are no naming conflics in users with auth obj
 * TODO: Online/Offline: Multiple clients same user!
 * TODO: Unsubscribe listeners when logging in a new user
 */
var userStore = Reflux.createStore({
  init: function() {
    // If it is just merged with itself items won't ever be deleted, need to cache each obj
    this.user = {}
    this.auth = {}
    this.meta = {}

    this.authClient = new Fb.FirebaseSimpleLogin(Fb.firebase, function(err, auth) {
      if (err)
        return console.log(err)

      if (!auth)
        return console.log('no session yet!')

      Fb.firebase.child('online').child(auth.uid).set(true)
      Fb.firebase.child('online').child(auth.uid).onDisconnect().remove()

      this.auth = auth  
      this.user = update(this.meta, {$merge: auth})

      Fb.firebase.child('users').child(auth.uid).on('value', function(snap) {
        this.meta = snap.val() || {}

        this.user = update(this.auth, {$merge: this.meta})
        this.trigger(this.user)
      }.bind(this))
    }.bind(this))

    this.listenTo(Actions.login, this.handleLogin)
    this.listenTo(Actions.takePicture, this.handlePic)
    this.listenTo(Actions.move, this.handleMove)
  },

  handleLogin: function() {
    this.authClient.login('anonymous', {rememberMe: true})
  },

  handlePic: function(picture) {
    if (!this.user.uid)
      return console.error('no uid')

    Fb.firebase.child('users').child(this.user.uid).update({
      profilePic: picture
    })
  },

  handleMove: function(position) {
    Fb.firebase.child('users').child(this.user.uid).update({
      position: position
    })
  }
})

module.exports = userStore
