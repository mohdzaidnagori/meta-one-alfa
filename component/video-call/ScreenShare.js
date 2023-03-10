import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../router/AuthContext";


function ScreenShare() {
  //   const rtc = useRef({
  //     client: null,
  // });
  //   const screenShareRef = useRef();
  //   const [isScreenSharing, setIsScreenSharing] = useState(false);
  //   console.log(rtc)
  // useEffect(() => {
  //   try {
  //     let init = async () => {
  //       rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  //     }
  //     init()
  //   } catch (error) {
  //     alert(error)
  //   }
  // async function init() {
  //   // Initialize the client
  //   rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  //   await rtc.current.client.init('da36455629d94befb15574e5405e473a');

  //   // Join a channel
  //   await rtc.current.client.join(null, 'main', null);

  //   // Create a screen share track
  //   const screenShareTrack = await AgoraRTC.createScreenVideoTrack({
  //     encoderConfig: '1080p_1',
  //   });

  //   // Play the screen share track
  //   screenShareTrack.play(screenShareRef.current);

  //   // Publish the screen share track
  //   const localScreenPublication = await rtc.current.client.publish(screenShareTrack);

  //   // Subscribe to remote streams
  //   client.on('user-published', async (user, mediaType) => {
  //     await rtc.current.client.subscribe(user, mediaType);
  //     if (mediaType === 'video') {
  //       // Create a div for the remote stream
  //       const remoteVideoStream = document.createElement('div');
  //       remoteVideoStream.id = user.uid;
  //       remoteVideoStream.style.width = '640px';
  //       remoteVideoStream.style.height = '480px';
  //       document.body.appendChild(remoteVideoStream);

  //       // Play the remote stream
  //       const remoteScreenTrack = user.videoTrack;
  //       remoteScreenTrack.play(remoteVideoStream);
  //     }
  //   });
  // }

  // init();

  // // Cleanup function
  // return () => {
  //   rtc.current.client.leave();
  // };
  // }, []);

  // async function startScreenShare() {
  //   setIsScreenSharing(true);
  // }

  // async function stopScreenShare() {
  //   setIsScreenSharing(false);
  // }

const {user} = useAuth()




 




    const [isSharingEnabled, setIsSharingEnabled] = useState(false);
    const [localPlayerContainer, setLocalPlayerContainer] = useState(null);
    const [channelParameters, setChannelParameters] = useState({
      screenTrack: null,
      localVideoTrack: null,
    });
    const [agoraEngine, setAgoraEngine] = useState(null);
    const [joined, setJoined] = useState(false);
    const [remotePlayerContainers, setRemotePlayerContainers] = useState([]);

    useEffect(() => {
      // Initialize Agora engine
      const engine = AgoraRTC.createClient({ mode: 'rtc', codec: 'h264', appId: 'da36455629d94befb15574e5405e473a' });
      setAgoraEngine(engine);

      // Create local video track
      AgoraRTC.createCameraVideoTrack().then((localVideoTrack) => {
        setChannelParameters((prev) => ({ ...prev, localVideoTrack }));
        localVideoTrack.play('localPlayerContainer');
      });

      // Join channel
      engine.join('da36455629d94befb15574e5405e473a', 'main', null).then(() => {
        setJoined(true);
      });

      // Listen for remote tracks
      engine.on('user-published', async (user, mediaType) => {
        // Subscribe to remote track
        await engine.subscribe(user, mediaType);
        // Create a container for the remote player
        const playerContainer = document.createElement('div');
        playerContainer.id = `remotePlayerContainer${user.uid}`;
        document.body.appendChild(playerContainer);
        // Play the remote track on the remote player container
        if (mediaType === 'video') {
          user.videoTrack.play(playerContainer);
        } else if (mediaType === 'screen') {
          user.screenTrack.play(playerContainer);
        }
        setRemotePlayerContainers((prev) => [...prev, playerContainer]);
      });

      // Listen for remote users leaving the channel
      engine.on('user-unpublished', (user, mediaType) => {
        // Stop playing the remote track
        if (mediaType === 'video') {
          user.videoTrack?.stop();
        } else if (mediaType === 'screen') {
          user.screenTrack?.stop();
        }
        // Remove the remote player container from the DOM
        const playerContainer = document.getElementById(`remotePlayerContainer${user.uid}`);
        playerContainer && playerContainer.remove();
        setRemotePlayerContainers((prev) =>
          prev.filter((container) => container.id !== `remotePlayerContainer${user.uid}`)
        );
      });

      return () => {
        // Cleanup
        engine && engine.leave();
        channelParameters.localVideoTrack && channelParameters.localVideoTrack.stop();
        remotePlayerContainers.forEach((container) => container.remove());
      };
    }, []);

    const toggleScreenShare = async () => {
      if (isSharingEnabled) {
        // Stop screen sharing
        await agoraEngine.unpublish(channelParameters.screenTrack);
        channelParameters.screenTrack.close();
        setChannelParameters((prev) => ({ ...prev, screenTrack: null }));
        setIsSharingEnabled(false);
      } else {
        // Start screen sharing
        const screenTrack = await AgoraRTC.createScreenVideoTrack();
        await agoraEngine.publish(screenTrack);
        setChannelParameters((prev) => ({ ...prev, screenTrack }));
        setIsSharingEnabled(true);
      }
    };

    return (
      <div>
        {/* {isScreenSharing ? (
        <button onClick={stopScreenShare}>Stop screen share</button>
      ) : (
        <button onClick={startScreenShare}>Start screen share</button>
      )}
      <div ref={screenShareRef}></div> */}
        <div id="localPlayerContainer" className="local-player-container" ref={setLocalPlayerContainer} />
        <button onClick={toggleScreenShare}>
          {isSharingEnabled ? 'Stop Screen Share' : 'Start Screen Share'}
        </button>
        <div className="remote-players-container">
          {remotePlayerContainers.map((container) => (
            <div key={container.id} className="remote-player-container" ref={() => container} />
          ))}
        </div>
      </div>

    );
  }

  export default ScreenShare;