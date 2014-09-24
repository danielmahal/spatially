var Firebase = require('firebase')
var FirebaseSimpleLogin = require('./lib/FirebaseSimpleLogin')

var firebase = new Firebase('https://spatially.firebaseio.com')

module.exports = {
  firebase: firebase,
  FirebaseSimpleLogin: FirebaseSimpleLogin
}
