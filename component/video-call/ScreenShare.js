import { useRef, useEffect, useState } from 'react'
import AgoraRTC from "agora-rtc-sdk-ng"
import { GlobalShare, useShareClient, useShareStart, useShareUsers } from './GlobalShare';
import { useAuth } from '../router/AuthContext';
import { AgoraRTCErrorCode } from 'agora-rtc-react';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { closeScreenModal } from '../redux/CounterSlice';

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
  const { user } = useAuth()
  const options = {
    // Pass your app ID here.
    appId: "7cb3a3478f8d4a8b9116744c3348244e", //"da36455629d94befb15574e5405e473a",
    // Set the channel name.
    channel: '12324324',
    // Pass a token if your project enables the App Certificate.
    token: null,
  };
  const appId = "7cb3a3478f8d4a8b9116744c3348244e";
  // Your Agora Token Service App Certificate
  const appCertificate = 'aa36d9595dab480fbcf99161d2794692';

  // The channel name to join
  const channelName = 'main';

  // The user ID for this user
  const userId = 0;
  const [element, setElement] = useState([])
  const [StreamStart, setStreamStart] = useState(false)
  const users = useShareUsers()[0]

  useEffect(() => {

    let init = async () => {
      try {
        const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, userId, RtcRole.PUBLISHER, Math.floor(Date.now() / 1000) + 86400);
        rtc.current.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await rtc.current.client.join(appId, channelName, token, user.displayName);

        const initClientEvents = () => {
          rtc.current.client.on("user-joined", async (user) => {

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
        setUsers((prevUsers) => {
          return [...prevUsers, { uid: user.displayName, client: true, video: true }]
        })


      } catch (error) {
        console.log(error)
      }
    }
    init()
  }, [])

  
      







  useEffect(() => {
    setElement(users);
  }, [users]);

  // useEffect(() => {
  //   console.log(users)
  //   console.log(rtc.current.localScreenTrack) 
  //   if (rtc.current.localScreenTrack) {
  //     setStreamStart(false)
  //   }
  //   else{
  //     setStreamStart(true)
  //   }
  // }, [users])

  const streamhandle = async () => {
   try {
    setUsers((prevUsers) => {
      return prevUsers.filter(User => User.uid !== user.displayName)
    })
    if (StreamStart) {
      if (rtc.current.localScreenTrack) {
        await rtc.current.client.unpublish([rtc.current.localScreenTrack]);
        rtc.current.localScreenTrack.stop();
        rtc.current.localScreenTrack.close();
        // setUsers((prevUsers) => {
        //   return prevUsers.filter(User => User.uid !== user.displayName)
        // })
        setUsers((prevUsers) => {
          return [...prevUsers, { uid: user.displayName, client: true, video: true }]
        })
      }
      setStreamStart(false)
    }
    else {
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
        return [...prevUsers, { uid: user.displayName, client: true, video: true, screenTrack: rtc.current.localScreenTrack, name: user.displayName }]
      })
      //Publishing your Streams
      await rtc.current.client.publish([rtc.current.localScreenTrack]);
      setStreamStart(true)
    }
   } catch (error) {
     console.log(error)
     setUsers((prevUsers) => {
      return [...prevUsers, { uid: user.displayName, client: true, video: true }]
    })
   }
  }

  const [lastClickedIndex, setLastClickedIndex] = useState(null);
  const hadlearrayPostion = (index) => {
    if (lastClickedIndex !== null && index === lastClickedIndex) {
      // if the same index was clicked twice, don't do anything
      return;
    }
    const newArray = [...users];
    const clickedItem = newArray.splice(index, 1)[0];
    newArray.unshift(clickedItem);
    setElement(newArray);
    console.log(index)
    setLastClickedIndex(index);
  }
  const dispatch = useDispatch()

  // useEffect(() => {
  //   const stream = navigator.mediaDevices.getUserMedia({ video: true });
  //   const videoTrack = stream.getVideoTracks()[0];

  //   const handleVideoEnded = () => {
  //     // do what you need to do when video ends
  //     alert('zaid nagori')
  //   };

  //   videoTrack.onended = handleVideoEnded;

  //   return () => {
  //     videoTrack.onended = null;
  //   };
  // }, []);
    useEffect(() => {
      rtc.current.localScreenTrack?.on("track-ended", async (evt) => {
        await rtc.current.client.unpublish([rtc.current.localScreenTrack]);
        rtc.current.localScreenTrack.stop();
        rtc.current.localScreenTrack.close();
        setStreamStart(false)
      })
    },[rtc.current.localScreenTrack])
   


  return (

    <div className="screen-main-conatiner">
      <span onClick={() => dispatch(closeScreenModal())} className='screen-main-conatiner-close' ><AiOutlineClose /></span>
      <div className="row gy-0 gx-0">
        {element.length !== 0 && element.map((user, index) => <Video onClick={() => hadlearrayPostion(index)} key={user.uid} user={user} index={index} />)}
      </div>
      <button className='spaces-new screen-share-position' style={{ width: 'max-content', paddingInline: '20px' }} onClick={streamhandle}>
        {
          StreamStart
            ?
            'Stop Parsenting'
            :
            'Share Your Screen'
        }
      </button>

    </div>

  )
}

export const Video = ({ user, index, onClick }) => {
  const [color, setColor] = useState({
    color1: '',
    color2: ''
  })
  const vidDiv = useRef(null)
  const playVideo = () => {
    if (user.video && !user.client) {
      user.screenTrack?.play(vidDiv.current)
    }
  }
  // playVideo()
  const stopVideo = () => {
    user.screenTrack?.stop()

  }

  useEffect(() => {
    playVideo()
    return () => {
      stopVideo()
    }


  }, [user.video, user.client, onClick, index])

  const handleClick = () => {
    onClick(index); // Call the onClick handler with the index value
  };


  function getRandomColor() {
    let r, g, b;

    do {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
    } while (r + g + b > 600); // exclude light colors

    return `rgb(${r}, ${g}, ${b})`;

  }
  useEffect(() => {
    const randomStyle = getRandomColor();
    const randomStyle1 = getRandomColor();
    setColor({
      color1: randomStyle,
      color2: randomStyle1
    })
  }, [])
  const Color = color.color1
  const Color1 = color.color2
  console.log(Color1)
  return (
    <>


      {
        index === 0 ?
          <div onClick={handleClick} key={index} className="col-md-12 agora_video_player-parents" data-uid={user.uid} data-icon={user.uid.charAt(0)} style={{ height: '500px' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: Color }} ref={vidDiv} >
            </div>

          </div>
          :
          <div onClick={handleClick} key={index} className="col-md-2 agora_video_player-child" data-uid={user.uid} data-icon={user.uid.charAt(0)} style={{ height: '100px' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: Color }} ref={vidDiv} >
            </div>
          </div>

      }

      <style jsx>
        {
          `
               .agora_video_player-parents::before{
                content: attr(data-icon);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color:${Color1};
                width: 30%;
                height: 50%;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 100px;
                text-transform: uppercase;
                color: #fff;
              }
              .agora_video_player-child::before{
                content: attr(data-icon);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                width: 35%;
                height: 50%;
                border-radius: 50%;
                background-color:${Color1};
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                text-transform: uppercase;
                color: #fff;
              }
               `
        }
      </style>

    </>
  )
}



export default ScreenShare;


