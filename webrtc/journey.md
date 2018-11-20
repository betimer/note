
# Journey to build the WebRTC cross-browser video call (Specially Chrome + Safari)

## Prepare framework and tools

signalling framework: rtcio, rtc-quickconnect

messaging method: socket.io

WebRTC helper: adapter.js (adapter is very useful to deal with multiple browsers in terms of WebRTC, and it is still being actively maintained)

## Capture user media stream

I know there are a lot of libraries dealing with `getUserMedia()` in different browsers, such as [getScreenMedia](https://www.npmjs.com/package/getscreenmedia).

Fortunately, with the new standard of WebRTC you just need the same method: `navigator.mediaDevices.getUserMedia()`

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

## Constraint of getUserMedia

This can consume your time bigly (which kills my time massively). There are so many constraint types you can set when you call `getUserMedia()`, but problems can come together with this.

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

<!-- 
Some info links:
https://webrtcdemo.attendanywhere.com/constraint.html
https://webrtc.github.io/samples/src/content/peerconnection/constraints
 -->

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

First of all, you need to know all your available device list:

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

* **1. stop the existing video track**

Well I want to say more of this step, It is !Important. At times I got blue screen because of missing this step, and this is the moment that your camera's light will be turned off.

    `localStream.getVideoTracks()[0].stop();`

* **2. obtain your new camera's stream, this time only video**

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
        // 1. locally
        // here we need to display your new local video
        // to display locally, just create `<video>` and set srbObject

        // 2. remotely
        // tell remote to use the new video (step 3)
    });
```

* **3. use the new video track to update remote peer connection**

Before the new interface and standard, if you want to change the camera, you need to remove the existing MediaStream object and add new MediaStream object. And this, requires the peer connection renegotiation, which takes longer time and much unstable.

Then if all the peer connection has been setup, I just want to kind of change my video, why do I have to go to the whole process again? Yes, there is new and better way to go: `replaceTrack`

to let remote peers use your new video track, make use of new WebRTC interface *replaceTrack*

```js
peerConnections.forEach(function(pc) {
    var sender = pc.getSenders().find(function(s) {
        return s.track.kind == track.kind;
    });
    console.log('found sender:', sender);
    sender.replaceTrack(track);
});
```

* **4. Minor notice about the event difference**

1. if chrome calls `replaceTrack`, no track event will be fired on remote sides (chrome or safari)
2. if safari 11.1.1 calls `replaceTrack`, track event will be fired on remote peers (video track gets fired, with existing same stream object)
3. if safari 12 calls `replaceTrack`, no track event will be fired on remote sides

## Change speaker

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

## An extra field of video element in Safari in order to cross-browser

In safari, make sure these elements have been set

```js
video.setAttributeNode(document.createAttribute('autoplay'));
video.setAttributeNode(document.createAttribute('playsinline'));
```

## Work out the call statistics

```js
pc
.getStats()
.then(rawStats => {
    var statsList = [];
    rawStats.forEach(p=>statsList.push(p));
    console.log('stats:', pc.id, statsList);
});
```

## Changing the video bandwidth on the fly via setParameters()

`sender.setParameters()` is currently only supported in Chrome.

`sender.getParameters()` is currently supported in Chrome/Safari.

```js
var p = pc.getSenders()[1].getParameters(); // imagine sender[1] is the video
p.encodings[0].maxBitrate = 300 * 1000;
// for more encoding fields, check https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpEncodingParameters
p.degradationPreference = 'maintain-resolution'; // maintain resolution instead of frame rate
pc.getSenders()[1].setParameters(p)
```

If you think this does not seem to be magic, why not just set it somewhere when initilizing the connection? Well, the most key point is that this gives power of dynamic optimization, where one party is able to set different setting to different remote others (e.g. one is laptop with wifi, and one is mobile with 4G)

3 interesting ones are: maxBitrate, maxFramerate, scaleResolutionDownBy

## Changing the video resolution on the fly via setParameters()

There is a useful parameter `scaleResolutionDownBy` from WebRTC track related, which can help with changing the resolution, specially reduce the quality. Of course, you cannot make it better than orginial capture, but you might be able to change it back to same original quality if you ever reduced it before.

```js
var expectedWidth = 320;
var track = localStream.getVideoTracks()[0];
var sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
var p = sender.getParameters();
var currentWidth = track.getSettings().width;
// sender.setParameters({encodings: [{maxBitrate, scaleResolutionDownBy: currentWidth / expectedWidth}]})
// var setting = {scaleResolutionDownBy: 1.0 * currentWidth / expectedWidth};
// p.encodings.push(setting);
p.encodings[0].scaleResolutionDownBy = 1.0 * currentWidth / expectedWidth; // if encodings[0] not null
sender.setParameters(p);
```

I haven't fully tested this scenario, it might only work on Chrome, it seems at some stage, this does not allow you to set. It may be a read-only field at some stages.

## Then you get the Safari limitation: on more than 1 video element can have sound to play, a limitation of multiple callers

Though chrome currently does not have this issue.

Multiple Simultaneous Audio or Video Streams: <https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html>

https://bugs.webkit.org/show_bug.cgi?id=176282

That description is partly true, so you can have 3 video element play simultaneously, but as long as no more than 1 video has sound (others need to be muted)

Then how to overcome this?

This means we should combine all the remote audios into a single video element to play. A good candidate is your local video element (if you choose one of remote callers, and if that caller leaves,  need extra logic failover to another remote caller)

In most applications, the local video element would just use mediaStream which has been obtained via getUserMedia and make it muted. The existing 

```js
var newLocalStream = new MediaStream();
newLocalStream.addTrack(stream.getVideoTracks()[0]);
remoteAudioTracks.forEach()
```

## Then when mute mic, sometimes safari can make u into a media speaker mode (instead of call speaker mode)

This does not sound too much harmful, as long as you can change the volume after the speaker mode gets changed.

The biggest issue is, however, once you are in media speaker mode (you can fully zoom volumn to 0), when you unmute, safari may not respond as quickly as you expect. And this, causes remote parties are not able to hear you.

Fix is: find the video element and do: `videoEle.load()`

I do believe it's Safari delay problem because I have seen after around 2~5 mins, it can go back to the correct speaking mode. But, how can you make caller wait that long as silence?

## If android chrome <70, it may not work well with safari on ios

`OperationError: Failed to set remote offer sdp: Session error code: ERROR_CONTENT. Session error description: Failed to set remote video description send parameters.. (anonymous function)`

## Safari may not fully respect the media capture constraint when calling getUserMedia

Some getUserMedia constraints may not be respected by Safari, it might complain then fail or just ignored. E.g. if specifying the frameRate to be 1 (1 frame per second), Safari just captures its native camera frameRate.

## Fullscreen mode (Android + iPad)

To make the apple behave a bit better, browsers provide fullscreen mode. This makes it more like running a native app. However, in safari IOS part, I can only find it supports on iPad instead of iPhone.

```js
var docElm = document.documentElement;
if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
}
else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
}
else if (docElm.webkitEnterFullScreen) {
    docElm.webkitEnterFullScreen();
}
else {
    return false;
}
```

## Switch camera (fast changing camera)

I've covered the change camera case, which chooses the camera from the list, setting the `deviceId` then recapture the mediaStream.

Switch camera is a bit different. Instead of relying on `deviceId`, it relies on `facingMode` (whose value can be user or environment). As you can probably guess, it only support mobile or some tab, since it requires having both front and back camera.

## Safari hidden video speaker issue (too many parties, the speaking video overlapped)

This can happen and it is in a dangerous zone, and especially you are not a responsive design.(Though it might not be the most case). But it is critical, that is if putting all remote audio tracks into a video element, and somehow you get to many participants, and the "speaking" is aligned in a place that out of the safari visible area, you might not be able to hear the sound.

The solution is simple, just make the speaking video visible in the page. But I learnt the hard way from this.

## When devices plugged in or plugged out, update selection items

In order to get better, we need to make it aware of newly devices plugged in, e.g. HD camera. In order to accomplish that, we need to make use of an event: `navigator.mediaDevices.ondevicechange`. It is available on both Chrome and Firefox. However, this is *unavailable* in Safari (As of 12).

## 150 wakeups per second limit in Safari

`45001 wakeups over the last 167 seconds (269 wakeups per second average), exceeding limit of 150 wakeups per second over 300 seconds`

That is the error that may happen on Safari, and it usually happens when there is multiple way call, practically, 4-way or 5-way call. One way which I found is helpful is to reduce the frameRate of the video. But I hold the opinion that it is a limitation of Safari.

## before and after success of `getUserMedia` in safari, it tells you different list items of devices, and the device id has been changed

If asking safari how many devices you have before success of `getUserMedia`, it may return 2 devices (one mic and one camera, even if you plug in more mics and cameras). However after success media capture, it might tell you more. Besides, this is more problematic (I also believe it is a bug of Safari): the deviceId has been changed.

This causes trouble that:

1. You may not be able to use external camera directly
2. Once media captured, you need to refresh your device item list
3. You cannot remember the chosen device (maybe through localStorage), and reuse the id once refreshed
