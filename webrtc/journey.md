
# Journey to build the WebRTC cross browser video call

## prepare: choose signalling framework

rtcio, quickconnect

## prepare: choose messaging method

socket.io

## prepare: adapter.js

## capture user media stream

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

## getUserMedia Constraint

This can consume your time bigly (which kills my time massively). There are so many contraint types you can set when you call `getUserMedia()`, but problems can come together with this.

First of all, to check which types of constraint your browser supports: `navigator.mediaDevices.getSupportedConstraints()` You will get an object with each type flag as true or false.

Some of the common types are: `height`,`width`,`frameRate`,`deviceId`,`facingMode`. And some of them support `ideal`, `min` and `max`;

Some examples for the constraint: (some will be used in the later section)

```js
// simple get default audio and video
{video:true, audio: false}
// get video with 640x360, and system default audio
{"video":{"height":{"ideal":360},"width":{"ideal":640}},"audio":true}
// get video only, and from the specific device (usually when user chose a camera)
{"video":{"width":{"ideal":640},"deviceId":{"exact":"2196afda0f21b57365aede21c989c8cc2ad2e2cc69f663cd1e432b7ebb64da4c"}},"audio":false}
// get video only, and using the back camera (usually on a mobile device)
{"video":{"width":{"ideal":640},"facingMode":{"exact":"environment"}},"audio":false}
```

## Play the media stream (video and audio)

After you obtained your media `stream` (camera and mic), you will do 2 things: display your local + send it to remote peers.

```js
// create video element, and put the stream into it to play
var video = document.createElement('video');
video.style.display = 'inline-block';
video.setAttributeNode(document.createAttribute('autoplay'));
video.setAttributeNode(document.createAttribute('playsinline'));
video.srcObject = stream;
// if your local audio, then muted on your side
if (isLocal) { video.muted = true;}
```

## mute camera and mic (for the remote peers)

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


## Change device: 1. list available devices

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

Then, later on, after detecting the event when user changed the camera/mic, it's time to do the following operation.

## Change device: 2. change camera/microphone

It's very tricky and also very dangerous if you do not operate this properly. Imagine you have 2 cameras (one built in one external), and you switch between them many times. Well, here is what happens: you may get blue screen. I already got it quite a few times, and the key cause could be lack of stopping previous device.

1. stop the exsting video track. Well I want to say more of this step, It is !Important. At times I got blue screen because of missing this step, and this is the moment that your camera's light will be turned off.

    `localStream.getVideoTracks()[0].stop();`

2. obtain your new camera's stream, this time only video

```js
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
```

3. use the new video track to display on your local and remote peer connection

    3.1. to display locally, just create `<video>` and set srbObject

    3.2. to let remote peers use your new video track, make use of new WebRTC interface *replaceTrack*

```js
peerConnections.forEach(function(pc) {
    var sender = pc.getSenders().find(function(s) {
        return s.track.kind == track.kind;
    });
    console.log('found sender:', sender);
    sender.replaceTrack(track);
});
```

## change speaker

```js
allVideoElements.forEach(function(el) {
    el.setSinkId(deviceId)
    .then(function() {
        console.log('set speaker successful', el);
    })
    .catch(function(err) {
        console.error('failed setting speaker', el);
    });
});
```

## cross browser (supporting safari)

In safari, make sure these elements have been set

```js
video.setAttributeNode(document.createAttribute('autoplay'));
video.setAttributeNode(document.createAttribute('playsinline'));
```

## work out the call statistics

## Changing the video bandwidth on the fly via setParameters()

`sender.setParameters()` is currently only supported in Chrome.

`sender.getParameters()` is currently supported in Chrome/Safari.

```js
var p = signaller.calls.values()[0].pc.getSenders()[1].getParameters();
p.encodings[0].maxBitrate = 300 * 1000;
signaller.calls.values()[0].pc.getSenders()[1].setParameters(p)
```
