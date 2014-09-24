var React = require('react/addons')
var Reflux = require('reflux')
var Actions = require('../actions')
var Fb = require('../firebase')

var update = React.addons.update

/**
 * usersStore fetches all info from firebase users of users currently online
 *
 * TODO(Simen? :) ): Immutability helper lacks:
 * 1) Ability to access object keys by variable name (ugly 'obj' variable)
 * 2) Clean way of deleting object keys
 */
var usersStore = Reflux.createStore({
  init: function() {
    this.users = {}

    Fb.firebase.child('online').on('child_added', function(snap) {
      var userKey = snap.name()

      Fb.firebase.child('users').child(userKey).on('value', function(snap) {
        var obj = {}
        obj[userKey] = snap.val()
        this.users = update(this.users, {$merge: obj})

        this.trigger(this.users)
      }.bind(this))
    }.bind(this))

    Fb.firebase.child('online').on('child_removed', function(snap) {
      var userKey = snap.name()

      Fb.firebase.child('users').child(userKey).off('value')

      var obj = {}
      obj[userKey] = {$apply: function() {return undefined}}

      this.users = update(this.users, obj)

      this.trigger(this.users)
    }.bind(this))
  }
})

module.exports = usersStore
