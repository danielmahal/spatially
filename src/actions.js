var Firebase = require('firebase')
var ref = new Firebase('https://spatially.firebaseio.com')

module.exports = {
  login: function() {
    ref.authAnonymously(function(err, auth) {
      ref.child('users').child(auth.uid).once('value', function(snap) {
        if (!snap.val())
          ref.child('users').child(auth.uid).set({position: {x: 0, y: 0}})
      })
    })
  },

  takePicture: function(imgData) {
    var auth = ref.getAuth()

    ref.child('users').child(auth.uid).update({
      profilePic: imgData
    })
  },

  move: function(data) {
    var auth = ref.getAuth()

    ref.child('users').child(auth.uid).update({
      position: data
    })
  }
}
