
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

Testing camera resolution: <https://webrtchacks.github.io/WebRTC-Camera-Resolution>

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
