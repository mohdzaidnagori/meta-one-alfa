import { useRef, useEffect, useState } from 'react'
import AgoraRTC from "agora-rtc-sdk-ng"
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


  }, [])


  const [element,setElement] = useState([])
  const users = useShareUsers()[0]
  useEffect(() => {
    setElement(users);
  }, [users]);

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
  console.log(element)
  return (
  
    <div className='main-body'>
    <div className="xxx-main-conatiner">
    <div className="row gy-0 gx-0">
      {element.length && element.map((user,index) =>  <Video onClick={() => hadlearrayPostion(index)} key={user.uid} user={user} index={index} />)}
    </div>
    <button onClick={streamhandle}>stream</button>
    </div>
    </div>
  
 )
}

export const Video = ({ user,index,onClick }) => {
  const vidDiv = useRef(null)
  const playVideo = () => {
      if(user.video && !user.client){
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
  

  }, [user.video,user.client,onClick,index])

  const handleClick = () => {
    onClick(index); // Call the onClick handler with the index value
  };

  return (
    <>
 
    
        {
                index === 0 ? 
               <div onClick={handleClick} key={index} className="col-md-12 agora_video_player-parents" data-uid={user.uid} data-icon={user.uid.charAt(0)} style={{height:'600px'}}>
               <div   style={{width:'100%',height:'100%'}} ref={vidDiv} > 
                </div>
               </div>
                :
                <div onClick={handleClick} key={index} className="col-md-2 agora_video_player-child" data-uid={user.uid} data-icon={user.uid.charAt(0)} style={{height:'100px'}}>
                {/* <div className='vid-1' style={{width:!user.video || user.client ? '0px' : '500px',height:!user.video || user.client? '0px' : '500px'}} ref={vidDiv} >  */}
                <div   style={{width:'100%',height:'100%'}} ref={vidDiv} > 
                </div>
                </div>
                 }
         
  </>
  )
}



export default ScreenShare;


