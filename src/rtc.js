'use strict';

var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

/**
 * TODO: Figure out renegotiation / listen on new SDPs.
 */
function rtc(ref, stream, callback) {
  var listeners = [];

  if (!callback)
    callback = function noop() {};

  ref.onDisconnect().remove();

  var server = {
    iceServers: [
      { url: 'stun:23.21.150.121' },
      { url: 'stun:stun.l.google.com:19302' }
    ]
  };

  var options = {
    optional: [
      { DtlsSrtpKeyAgreement: true },
      { RtpDataChannels: true }
    ]
  };

  var pc = new PeerConnection(server, options);

  pc.onaddstream = function(evt) {
    var stream = evt.stream;
    callback(null, stream);
  };

  pc.addStream(stream);

  var constraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    }
  };

  pc.createOffer(function(offer) {
    ref.child('offer').child('sdp').transaction(function(currentOffer) {
      return currentOffer ? undefined : JSON.stringify(offer);
    }, function(err, success, snap) {
      if (err)
        return callback(err);

      if (pc.signalingState === 'closed')
        return callback('Connection was closed before handshake completed');

      var local = success ? 'offer' : 'answer';
      var remote = success ? 'answer' : 'offer';

      if (success) {
        pc.setLocalDescription(offer);
        var sdpRef = ref.child(remote).child('sdp')
        listeners.push({
          type: 'value',
          ref: sdpRef,
          callback: sdpRef.on('value', function(snap) {
            var remoteSdp = JSON.parse(snap.val());
            if (!remoteSdp || pc.signalingState === 'closed')
              return;

            pc.setRemoteDescription(new SessionDescription(remoteSdp));
          })
        });
      } else {
        pc.setRemoteDescription(new SessionDescription(JSON.parse(snap.val())));
        pc.createAnswer(function(answer) {
          ref.child(local).child('sdp').transaction(function(currentAnswer) {
            return currentAnswer ? undefined : JSON.stringify(answer);
          }, function(err, success, snap) {
            if (err)
              return callback(err);
            if (!success)
              return callback('Both offerer and answerer already set!');
            if (pc.signalingState === 'closed')
              return callback('Connection was closed before handshake completed');

            pc.setLocalDescription(answer);
          });
        }, function(err) {
          return callback(err);
        }, constraints);
      }

      pc.onicecandidate = function(evt) {
        if (!evt.candidate)
          return;

        ref.child(local).child('ice').push(JSON.stringify(evt.candidate));
      };

      var iceRef = ref.child(remote).child('ice');
      listeners.push({
        type: 'child_added',
        ref: iceRef,
        callback: iceRef.on('child_added', function(snap) {
          var iceCandidate = JSON.parse(snap.val());

          if (!iceCandidate || pc.signalingState === 'closed')
            return;

          pc.addIceCandidate(new IceCandidate(iceCandidate));
        })
      });
    });
  }, function(err) {
    return callback(err);
  }, constraints);

  return {
    close: function() {
      listeners.forEach(function(listener) {
        listener.ref.off(listener.type, listener.callback);
      });
      ref.remove();
      pc.close();
    }
  };
}

module.exports = rtc;
