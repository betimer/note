
# Build cross-browser WebRTC video call using rtcio

This article is mainly discussing about chrome (on laptop and Andriod) and safari (on Mac and IOS).

## Intro to WebRTC

**WebRTC** is a free, open project that provides browsers and mobile applications with Real-Time Communications (RTC) capabilities via simple APIs. The WebRTC components have been optimized to best serve this purpose.

There are lots of advantages of WebRTC:

- it's free, and open source
- it's P2P
- always-on voice and video encryption
- device independence, more and more browsers are supporting it, this article will show between chrome and safari
- support multiple stream/tracks, you can change or even add camera, or add screenshare

## What are the key componensts

- **Signalling**: peer exchange information. Even though it's P2P, but need a machanism to send/receive data for setting up connection, also you may add authentication check in this step. That's where you should build server for.
- **ICE**: A framework that tries to setup connection. If direct network card fails, then external address obtained from STUN, if still fail then use TURN.
- **STUN**: used to get an external network address (public IP:Port)
- **TURN**: relay traffic if direct (peer to peer) connection fails. (stream traffic, e.g. video or audio)
- Every TURN server supports STUN: a TURN server is a STUN server with added relaying functionality built in

[//]: <> (stun.png or ./stun.png)

![Getting Started](stun.png)
![Getting Started](turn.png)
![Getting Started](peerc.png)

## What libs and tools do I use

rtcio: <https://github.com/rtc-io>

webrtc-adapter: <https://github.com/webrtc/adapter>

## Media and access

I know there are a lot of libraries dealing with `getUserMedia()` in different browsers, such as [getScreenMedia](https://www.npmjs.com/package/getscreenmedia).

Fortunately, with new standard of WebRTC you just need the same method: `navigator.mediaDevices.getUserMedia()`

```js
navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: true
      })
    .then(function(stream){
        // handle the obtained stream
    })
    .catch(errorFunc);
```

Note that when you call this function, that's the moment that your browser will ask permission for camera/mic permission.

## Display media (video and audio)

After you obtained your media `stream` (camera and mic), you will do 2 things: display your local + send it to remote peers.

```js
// Locally: create video element, and put the stream into it to play
var video = document.createElement('video');
video.style.display = 'inline-block';
video.setAttributeNode(document.createAttribute('autoplay'));
video.setAttributeNode(document.createAttribute('playsinline'));
video.srcObject = stream;
if (isLocal) { video.muted = true;}
```

```js
// Sending to remote (through RTCPeerConnection)
var video = document.createElement('video');
video.style.display = 'inline-block';
video.setAttributeNode(document.createAttribute('autoplay'));
video.setAttributeNode(document.createAttribute('playsinline'));
video.srcObject = stream;
// if (isLocal) { video.muted = true;}
```

## Safari video element

In safari, make sure these elements have been set

```js
video.setAttributeNode(document.createAttribute('autoplay'));
video.setAttributeNode(document.createAttribute('playsinline'));
```

## How to mute video or audio

First of all, without changing `MediaStream` object, you can mute the speaker in html level, which is just the example before:

```js
if (isLocal) { videoElement.muted = true;}
```

But how do we mute my video/audio so that the remote peer cannot receive my video/audio?

```js
// you need to set *enabled* for each peer connection's video track
peerConnections.forEach(function(pc) {
    var senders = pc.getSenders().filter(s => s.track.kind == 'video');
    senders.forEach(s => s.track.enabled = false);
  });
```

## Change device: camera/microphone

First of all you need to know all your avaiable device list:

```js
navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
            // kind: videoinput/audioinput/audiooutput
            console.log(device.kind, device.label, device.deviceId);
            // you may need to put this into your <select><option>
        });
    });
```

After detected the event when user changed the camera/mic: (camera in this code example)

```js
// 1. stop the exsting video track. Well I want to say more of this step, It is !Important. At times I got blue screen because of missing this step, and this is the moment that your camera's light will be turned off.
localStream.getVideoTracks()[0].stop();

// 2. obtain your new camera's stream, this time only video
navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: {
        deviceId: {
          exact: window.selectedCameraDeviceId
        }
      }
    })
    .then(function(stream) {
        // handle the new stream (step 3)
    });

// 3. use the new video track to display on your local and remote peer connection
// 3.1. to display locally, just create <video> and set srbObject
// 3.2. to let remote peers use your new video track, make use of new WebRTC interface *replaceTrack*
peerConnections.forEach(function(pc) {
    var sender = pc.getSenders().find(function(s) {
        return s.track.kind == track.kind;
    });
    console.log('found sender:', sender);
    sender.replaceTrack(track);
});
```

## WebRTC 1.0 is changing stream based to track based

Basically, MediaStream is the container of MediaStreamTrack (video or audio), that's why you can obtain video/audio tracks from `stream.getVideoTracks()` or `stream.getAudioTracks()`

Previously, WebRTC events are based on stream level (`addstream`, `removestream`, more info: [MediaStreamEvent](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamEvent)) But now they are being deprecated.

Now new standard comes: WebRTC track based. Basically instead of getting event of 1 `addstream`, you get 2 `track` events.

Then how should I display the `<video>` since it needs to set `srcObject` which is stream type?

```js
// it's easy when u bind the track event listener
pc.ontrack = function(evt) {
    console.log('track and stream', evt.track, evt.streams[0]);
};
```

