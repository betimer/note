
# Build cross-browser WebRTC video call

This article is mainly discussing about chrome (both laptop and Andriod) and safari (Mac and IOS).

## Intro to WebRTC

**WebRTC** is a free, open project that provides browsers and mobile applications with Real-Time Communications (RTC) capabilities via simple APIs. The WebRTC components have been optimized to best serve this purpose.

There are lots of advantages of WebRTC:

- it's free, and open source
- it's P2P
- always-on voice and video encryption
- device independence, more and more browsers are supporting it, this article will show between chrome and safari
- support multiple stream/tracks, you can change or even add camera, or add screenshare

## What are the key componensts

- Signalling: peer exchange information
- ICE: A framework that tries to setup connection. If direct network card fails, then external address obtained from STUN, if still fail then use TURN.
- STUN: used to get an external network address (public IP:Port)
- TURN: relay traffic if direct (peer to peer) connection fails. (stream traffic)
- Every TURN server supports STUN: a TURN server is a STUN server with added relaying functionality built in

[//]: <> (stun.png or ./stun.png)

![Getting Started](stun.png)
![Getting Started](turn.png)
![Getting Started](peerc.png)

## Media and access

I know there are a lot of libraries dealing with `getUserMedia()` in different browsers, such as [getScreenMedia](https://www.npmjs.com/package/getscreenmedia).

Fortunately, with new standard of WebRTC you just need the same method: `navigator.mediaDevices.getUserMedia()`

```js
navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: true
      })
    .then(handleStreamFunc)
    .catch(errorFunc);
```

## Display media (video and audio)

## Safari video element

## How to mute video or audio

## Change device: camera/microphone

## WebRTC 1.0 is changing stream based to track based

## g
