import { useRef, useEffect } from 'react'
import AgoraRTC from "agora-rtc-sdk-ng"
import { GlobalProvider, useClient, useStart, useUsers, useSpeaking } from './GlobalContext';
import { BsMicMute, BsMic, BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs'
import { GlobalShare, useShareClient, useShareStart, useShareUsers } from './GlobalShare';
import { useAuth } from '../router/AuthContext';
import { useRouter } from 'next/router';
import { AgoraRTCErrorCode } from 'agora-rtc-react';

const ScreenShare = () => {
  const { user } = useAuth()
  return (
    <GlobalShare>
      <Content channelName='main' username={user.displayName} />
    </GlobalShare>
  );
}

const Content = () => {
  const setUsers = useShareUsers()[1]
  const [start, setStart] = useShareStart(true)
  const rtc = useShareClient()
  const router = useRouter()
  const {user} = useAuth()
  const options = {
    // Pass your app ID here.
    appId: "da36455629d94befb15574e5405e473a",
    // Set the channel name.
    channel: 'main',
    // Pass a token if your project enables the App Certificate.
    token: null,
  };
  useEffect(() => {
    try {
      let init = async () => {
        rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await rtc.current.client.join(options.appId, options.channel, options.token, user.displayName);
        const initClientEvents = () => {
          rtc.current.client.on("user-joined", async (user) => {
           
            // New User Enters
            await setUsers((prevUsers) => {
              return [...prevUsers, { uid: user.uid, video: user.hasVideo, client: false }]
            })
          });


          rtc.current.client.on("user-published", async (user, mediaType) => {
            console.log(user)
            await rtc.current.client.subscribe(user, mediaType);
            if (mediaType === "video") {
              const remoteVideoTrack = user.videoTrack;
              await setUsers((prevUsers) => {
                return (prevUsers.map((User) => {
                  if (User.uid === user.uid) {

                    return { ...User, video: true, screenTrack: remoteVideoTrack }
                  }
                  return User
                }))

              })
            }

          });

          rtc.current.client.on("user-unpublished", (user, type) => {
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
        setStart(true)
 
  }
      init()
    } catch (error) {
      console.log(error)
    }


  }, [useShareUsers()[0].uid])

  console.log(setUsers.uid)
  const users = useShareUsers()[0]
  console.log(users)

  const streamhandle = async () => {

    // const uid = await rtc.current.client.join(options.appId, options.channel, options.token, user.displayName);
       
    rtc.current.localScreenTrack = await AgoraRTC.createScreenVideoTrack({
      encoderConfig: {
        width: 1920,
        height: 1080,
        bitrate: 1.5 * 1024 * 1024,
        frameRate: 15,
      },
    });

    setUsers((prevUsers) => {
      return [...prevUsers, { uid: user.displayName, client: true, video: true, screenTrack:rtc.current.localScreenTrack}]
    })
    //Publishing your Streams
    await rtc.current.client.publish([rtc.current.localScreenTrack]);
  }

  return (
    <div className="App-1">
      {<div id="videos-1">
      {users.length && users.map((user) =>  <Video key={user.uid} user={user} />)}
    </div>}
    <button onClick={streamhandle}>stream</button>
    </div>
  
 )
}

export const Video = ({ user }) => {
  console.log(user)
  const vidDiv = useRef(null)
  const playVideo = () => {
      if(user.video && !user.client){
        user.screenTrack?.play(vidDiv.current)
        console.log(vidDiv.current)
      }
  }
  playVideo()
  const stopVideo = () => {
    if (user.video) {
      user.screenTrack?.stop()
    }
  }

  // useEffect(() => {
  //   playVideo()
  //   // return () => {
  //   //   stopVideo()
  //   // }
  //   // eslint-disable-next-line
  // }, [user.video])
 console.log(user.video)
  return (
    <div className='vid-1' style={{width:!user.video || user.client ? '0px' : '500px',height:!user.video || user.client? '0px' : '500px'}} ref={vidDiv} >
        
    </div>
  )
}



export default ScreenShare;


