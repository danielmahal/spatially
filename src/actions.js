var Firebase = require('firebase')
var ref = new Firebase('https://spatially.firebaseio.com')

module.exports = {
  login: function() {
    ref.authWithOAuthPopup('facebook', function() {})
  },

  logout: function() {
    ref.unauth()
  },

  move: function(data) {
    var auth = ref.getAuth()

    ref.child('users').child(auth.uid).update({
      position: data
    })
  }
}
