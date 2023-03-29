import { useRef, useEffect } from 'react'
import AgoraRTC from "agora-rtc-sdk-ng"
import { GlobalProvider, useClient, useStart, useUsers, useSpeaking } from './GlobalContext';
import { BsMicMute, BsMic, BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs'
import { useDispatch } from 'react-redux';
import { AddUser } from '../redux/CounterSlice'
import { useAuth } from '../router/AuthContext';
import { useRouter } from 'next/router';
import { query } from 'firebase/firestore';
import { IoExitOutline } from 'react-icons/io5';
import { AgoraRTCErrorCode } from 'agora-rtc-react';


const Agora = ({ channelName }) => {
  const { user } = useAuth()
  return (
    <GlobalProvider>
      <Content channelName={channelName} username={user.displayName} />
    </GlobalProvider>
  );
}

const Content = ({ channelName, username }) => {
  const setUsers = useUsers()[1]
  const [start, setStart] = useStart(true)
  const rtc = useClient()
  const router = useRouter()

  const options = {
    // Pass your app ID here.
    appId: "da36455629d94befb15574e5405e473a",
    // Set the channel name.
    channel: router.query.id,
    // Pass a token if your project enables the App Certificate.
    token: null,
  };

  const { user } = useAuth()
  useEffect(() => {
    try {
      let init = async (name) => {
        rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        const initClientEvents = () => {
          rtc.current.client.on("user-joined", async (user) => {
            // New User Enters
            await setUsers((prevUsers) => {
              return [...prevUsers, { uid: user.uid, audio: user.hasAudio, video: user.hasVideo, client: false }]
            })
          });


          rtc.current.client.on("user-published", async (user, mediaType) => {
            await rtc.current.client.subscribe(user, mediaType);
            if (mediaType === "video") {
              const remoteVideoTrack = user.videoTrack;
              await setUsers((prevUsers) => {
                return (prevUsers.map((User) => {
                  if (User.uid === user.uid) {

                    return { ...User, video: user.hasAudio, videoTrack: remoteVideoTrack }
                  }
                  return User
                }))

              })
            }

            if (mediaType === "audio") {
              console.log('audio')
              const remoteAudioTrack = user.audioTrack;
              remoteAudioTrack.play();
              await setUsers((prevUsers) => {
                console.log(prevUsers)
                return (prevUsers.map((User) => {
                  if (User.uid === user.uid) {
                    return { ...User, audio: user.hasAudio, audioTrack: remoteAudioTrack }
                  }
                  return User
                }))

              })
            }
          });

          rtc.current.client.on("user-unpublished", (user, type) => {
            if (type === 'audio') {
              setUsers(prevUsers => {
                return (prevUsers.map((User) => {
                  if (User.uid === user.uid) {
                    return { ...User, audio: !User.audio }
                  }
                  return User
                }))
              })
            }
            if (type === 'video') {
              setUsers(prevUsers => {
                return (prevUsers.map((User) => {
                  if (User.uid === user.uid) {
                    return { ...User, video: !User.video }
                  }
                  return User
                }))
              })
            }
          });

          rtc.current.client.on("user-left", (user) => {
            //User Leaves
            setUsers((prevUsers) => {
              return prevUsers.filter(User => User.uid !== user.uid)
            })
          });
        }
        initClientEvents()
      
        try {
          const uid = await rtc.current.client.join(options.appId, name, options.token, user.displayName);
          try {
            rtc.current.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
              encoderConfig: {
                sampleRate: 48000,
                stereo: true,
                bitrate: 128,
              },
            })
            // rtc.current.localAudioTrack.setVolume(10)
  
            // Create a video track from the video captured by a camera.
            rtc.current.localVideoTrack = await AgoraRTC.createCameraVideoTrack();


           
            //Adding a User to the Users State
            setUsers((prevUsers) => {
              return [...prevUsers, { uid: uid, audio: true, video: true, client: true, videoTrack: rtc.current.localVideoTrack, audioTrack: rtc.current.localAudioTrack}]
            })
            //Publishing your Streams
            await rtc.current.client.publish([rtc.current.localAudioTrack, rtc.current.localVideoTrack]);
            setStart(true)
          } catch (error) {
            console.log(error)
            rtc.current.localVideoTrack = null;
           
            setUsers((prevUsers) => {
              return [...prevUsers, { uid: uid, audio: true, video: false, client: true, audioTrack: rtc.current.localAudioTrack}]
            });
            await rtc.current.client.publish([rtc.current.localAudioTrack]);
            setStart(true);
          }
          
          // Join the channel with a specified UID
        } catch (error) {
          if (error.code === AgoraRTCErrorCode.UID_CONFLICT) {
            // Handle the UID conflict error here
            console.warn('A UID conflict occurred in the Agora RTC SDK');
          } else {
            // Handle other errors here
            console.warn('An error occurred while joining the channel:', error);
          }
        }
        // const nameUrl = `${user.displayName}cutdata${user.photoUrl === null ? '/images/login-images/thumbnail.png' : user.photoUrl}`
      


      }
      init(options.channel)
    } catch (error) {
      console.log(error)
    }


  }, [])





  return (
    <div className="App-1">
      {start && <Videos />}
    </div>
  )
}


const Videos = () => {

  const users = useUsers()[0]
  const dispatch = useDispatch();

  useEffect(() => {
    if (users.length != 0) {
      const data = users.map((user) => {
        return (
          {
            uid: user.uid,
            audio: user.audio,
            video: user.video,
            client: user.client,
            username: user.username,
            image: user.image
          }
        )
      })
      dispatch(AddUser(data));
      console.log(data)
      console.log(users)
    }
  }, [users])
  return (
    <div id="videos-1">
      {users.length && users.map((user) => <Video key={user.uid} user={user} />)}
    </div>
  )

}

export const Video = ({ user }) => {

  const vidDiv = useRef(null)
  const playVideo = () => {
    if (user.video) {
      user.videoTrack?.play(vidDiv.current)
    }
  }

  const stopVideo = () => {
    if (user.video) {
      user.videoTrack?.stop()
    }
  }

  useEffect(() => {
    playVideo()
    return () => {
      stopVideo()
    }
    // eslint-disable-next-line
  }, [user.video])
console.log(user)
  return (
    <div className='vid-1' data-icon={user.uid.charAt(0)} ref={vidDiv} >
      <Controls user={user} />
    </div>
  )
}


export const Controls = ({ user }) => {

  const setStart = useStart()[1]
  const setUsers = useUsers()[1]
  const rtc = useClient()
  const [speaking, setSpeaking] = useSpeaking()
  const query = useRouter()

  const leaveChannel = async () => {
    // Destroy the local audio and video tracks.
    await rtc.current.localAudioTrack.close();
    await rtc.current.client.leave();
    setUsers([])
    clearInterval(rtc.current.checkAudio)
    setStart(false)
    location.href = '/enviroment'
  }

  useEffect(() => {
    const startAudioCheck = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      const audioContext = new AudioContext();
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
      const analyserNode = audioContext.createAnalyser();
      mediaStreamAudioSourceNode.connect(analyserNode);
      const pcmData = new Float32Array(analyserNode.fftSize);

      const checkAudio = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) { sumSquares += amplitude * amplitude; }
        let vol = Math.sqrt(sumSquares / pcmData.length)
        if (vol > 0.05 && !speaking) {
          setSpeaking(true)
          setTimeout(() => { setSpeaking(false) }, 2000)
        }
      };

      if (user.audio === false) {
        rtc.current.checkSpeakingInterval = setInterval(checkAudio, 100)
      }
      else {
        clearInterval(rtc.current.checkSpeakingInterval)
      }
    }
    if (user.client) {
      startAudioCheck()
    }
    return () => {
      // eslint-disable-next-line
      clearInterval(rtc.current.checkSpeakingInterval)
    }
    // eslint-disable-next-line
  }, [user.audio])

  const mute = (type, id) => {
    if (type === 'audio') {
      setUsers(prevUsers => {
        return (prevUsers.map((user) => {
          if (user.uid === id) {
            user.client && rtc.current.localAudioTrack.setMuted(user.audio)
            return { ...user, audio: !user.audio }
          }
          return user
        }))
      })
    }
    else if (type === 'video') {
      setUsers(prevUsers => {
        return prevUsers.map((user) => {
          if (user.uid === id) {
            user.client && rtc.current.localVideoTrack?.setEnabled(!user.video)
            return { ...user, video: !user.video }
          }
          return user
        })
      })
    }
  }
  useEffect(() => {
    query.beforePopState(({ as }) => {
      if (as !== query.asPath) {
        window.history.forward()
        console.log(query.asPath)
        setTimeout(() => {
          location.reload()
        }, 1000);
      }
      return true;
    });

    return () => {
      query.beforePopState(() => true);
    };
  }, [query])
  console.log(rtc.current.localVideoTrack)
  return (
    <>
      {
        <div className={`mic-container-show ${!user?.video && 'data-icon-user-not'}`} data-icon={user?.uid.charAt(0)} >
          <div className='user-mic-show'>
            {user.audio ? <BsMic /> : <BsMicMute />}
          </div>
        </div>
      }
      <div className='leave-container'>
        <div className="unity-flex-child-leave" onClick={() => leaveChannel()}>  <span style={{ transform: 'rotate(180deg)' }}><IoExitOutline /></span>Exit</div>
      </div>

      <div className="control-box">
        {
          user.client &&
          <div className="unity-flex-child-1" onClick={() => user.client && mute('audio', user.uid)} data-name={!user.audio ? 'Mic off' : 'Mic on'}>
            {user.audio ? <BsMic /> : <BsMicMute />}
          </div>

        }
        {
          user.client && rtc.current.localVideoTrack !== null &&
          <div className="unity-flex-child-1" onClick={() => user.client && mute('video', user.uid)} data-name={!user.video ? 'camera off' : 'camera on'}>
            {user.video ? <BsCameraVideo /> : <BsCameraVideoOff />}
          </div>

        }
      </div>





    </>
  )
}


export default Agora;


