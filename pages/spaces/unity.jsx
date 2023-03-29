import Image from "next/image"
import { useRouter } from "next/router"
import { Fragment, useCallback, useEffect, useState, } from "react"
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineDeploymentUnit, AiOutlineHeart, AiOutlineLeft, AiOutlineRight, AiOutlineSearch, AiOutlineUserAdd } from "react-icons/ai"
import { RiCameraFill } from "react-icons/ri"
import { BsShare, BsChat } from 'react-icons/bs'
import { GiPauseButton, GiPortal } from 'react-icons/gi'
import { FiPlay } from 'react-icons/fi'
import { IoExitOutline } from "react-icons/io5"
import { useAuth } from "../../component/router/AuthContext"
import { MdAdd, MdOutlineScreenShare, MdOutlineSpeakerNotes } from "react-icons/md"
import { BiDirections, BiDotsHorizontalRounded, BiPencil } from "react-icons/bi"

import { Unity, useUnityContext } from "react-unity-webgl";
import { Unityloader } from "../../component/loader/Unityloader"
import Addcontent from "../../component/unity/Addcontent"
import { collection, doc, getDoc, onSnapshot, update, setDoc, where, writeBatch, deleteDoc } from "firebase/firestore"
import { db } from "../../firebase"
import toast, { Toaster } from 'react-hot-toast';
import dynamic from "next/dynamic"
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Agorausermodal from "../../component/unity/Agorausermodal";
import Chat from "../../component/unity/Chat";
import { saveAs } from 'file-saver'
import { AddCapture, AddLoading, openScreenModal } from "../../component/redux/CounterSlice";
import Directionmodal from "../../component/unity/Directionmodal";
import { query as FireQuery } from 'firebase/firestore'
import axios from "axios";


// import * as htmlToImage from "html-to-image";






export const Unitypage = ({ children, enviroment}) => {
  const { user } = useAuth()
  const query = useRouter()

  const [buttons, setButtons] = useState({
    like: false,
    mic: false,
    count: 120,
    play: false,
    videoCam: true,
    open: false,
  })



  //  const [pathId,setPathId] = useState(query.Id)
  //  const [pathType,setPathType] = useState(query.type)
  const [pathName, setPathName] = useState('')
  const [inputName, setInputName] = useState('')
  const [agoraShow, setAgoraShow] = useState(true)
  const [ismodal, setIsmodal] = useState(false)
  const [pathId, setPathId] = useState('')
  const [agoraUsermodal, setAgoraUsermodal] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [data, setData] = useState({
    positionX: '0',
    positionY: '0',
    positionZ: '0',
    rotate: '0',
    scale: '0',
  })
  const [urlData, setUrlData] = useState({})
  const [videoCam, setVideocam] = useState(false)
  const [copied, setCopied] = useState(false);
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hidebehindButtonChat, setHidebehindButtonChat] = useState(false)
  const [hidebehindButtonVideo, setHidebehindButtonVideo] = useState(false)
  const [directionModal, setDirectionModal] = useState(false)
 






  const isLoaded = true;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.loading);




  const likeHandle = () => {
    if (!buttons.like) {
      setButtons(prev => (
        {
          ...prev,
          count: buttons.count + 1,
          like: true
        }
      ))
    }
    else {
      setButtons(prev => (
        {
          ...prev,
          count: buttons.count - 1,
          like: false
        }
      ))
    }
  }
  const micHandle = (type) => {

    if (type === 'mic') {
      setButtons(prev => ({ ...prev, mic: !buttons.mic }))
    }
    if (type === 'video') {
      // setButtons(prev => ({...prev, videoCam:!buttons.videoCam}))
      setVideocam(!videoCam)
      setHidebehindButtonVideo(true)
      // setjoinStream(!joinStream)
    }
  }
  const playHandle = () => {
    setButtons(prev => ({ ...prev, play: !buttons.play }))
  }
  const nameHandle = (e) => {
    setInputName(e.target.value)
  }
  const submitInput = (e) => {
    e.preventDefault()
    // console.log(inputName)
    const docRef = doc(db, "spaces", query.query.id);
    const data = {
      name: inputName,
    };

    setDoc(docRef, data, { merge: true })
      .then(docRef => {
        // console.log(docRef)
        toast.success('Name Update Succesfuuly')
      })
      .catch(error => {
        toast.error('Unexpected Error');
      })

  }
  const leavehandle = async () => {
    if (!query.isReady) return;
    //     const url = 'https://asia-south1-metaone-ec336.cloudfunctions.net/api/removePlayerFromRoom'
    //     const data = {
    //       playerID:user.uid,
    //       roomID:query.query.id
    //     }
    //     var raw = JSON.stringify({
    //       "playerID":user.uid,
    //       "roomID": '7qSoNOGTi5XHzFpGGpBA'
    //     });
    // console.log(data)
    //     await axios.post(url,data).then((res) => {
    //       console.log(res)
    //     })
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // const roomId = query.query.id.toString()
    // const userId = user.uid.toString()
    // var raw = JSON.stringify({
    //   "playerID": userId,
    //   "roomID": roomId
    // });
    // console.log(raw)
    // var requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };

    // await fetch("https://asia-south1-metaone-ec336.cloudfunctions.net/api/removePlayerFromRoom", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
    location.href = '/enviroment'
    // const documentId = user.uid + query.query.id + 1
    // const documentRef = doc(db, 'players', documentId);


    // console.log(documentId)
    // deleteDoc(documentRef)
    //   .then(() => {
    //     console.log('Document deleted successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting document: ', error);
    //   });

  }






  useEffect(() => {
    if (!query.isReady) return;
    setPathName(query.query.name)
    setPathId(query.query.id)
    const dataExists = async () => {
      const docRef = doc(db, "spaces", query.query.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        //  console.log("Document data:", docSnap.data());
        setInputName(docSnap.data().name)
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
      }
    }
    dataExists()
    // .catch(console.error);


    // codes using router.query
  }, [query.isReady]);
  // const handleTransform = useCallback((posData) => {
  //     // setButtons(prev => ({...prev,open:show === 1 ? true : false}))
  //      const objPosition = {
  //       positionX:JSON.parse(posData).posX,
  //       positionY:JSON.parse(posData).posY,
  //       positionZ:JSON.parse(posData).posZ,
  //       rotate:JSON.parse(posData).posRotate,
  //       scale:JSON.parse(posData).posScale
  //     }
  //     setData(objPosition)
  // },[]);
  // useEffect(() => {
  //   addEventListener("sendTransform", handleTransform);
  //   return () => {
  //     removeEventListener("sendTransform", handleTransform);
  //   };
  // },[handleTransform,addEventListener,removeEventListener])








  const openModal = () => {
    setIsmodal(!ismodal)
  }
  const closedModalsidebar = (check) => {
    if (check === 'openPosition') {
      setButtons(prev => (
        {
          ...prev,
          open: false
        }
      ))
    }
    if (check === 'openVideo') {
      // setButtons(prev =>(
      //   {
      //    ...prev,
      //    videoCam:false
      //   }
      //    ))
      setHidebehindButtonVideo(false)
      setVideocam(false)
    }

  }
  const searchhandle = () => {

  }
  const sidebarVariants = {
    sidebarOpen: {
      width: "350px",
    },

    sidebarClosed: {
      width: "",
    },
  };

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }


  // const createFileName = (extension = "", ...names) => {
  //   if (!extension) {
  //     return "";
  //   }

  //   return `${names.join("")}.${extension}`;
  // };
  // const ref = createRef(null);

  // const takeScreenShot = async (node) => {
  //   const dataURI = await htmlToImage.toJpeg(node);
  //   return dataURI;
  // };

  // const download = (image, { name = "img", extension = "jpg" } = {}) => {
  //   const a = document.createElement("a");
  //   a.href = image;
  //   a.download = createFileName(extension, name);
  //   a.click();
  // };

  // const downloadScreenshot = () => takeScreenShot(ref.current).then(download);
  const agoraControl = () => {
    setAgoraUsermodal(!agoraUsermodal)
  }
  const directionModalHandle = () => {
    setDirectionModal(!directionModal)
  }
  const chatHandle = () => {
    setShowChat(false)
    setHidebehindButtonChat(false)
  }

  const captureImage = () => {
    dispatch(AddCapture(true));
  }

  useEffect(() => {
    if (!query.isReady) return;
    const q = FireQuery(collection(db, "chats"), where("spaceId", "==", query.query.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          read: data.readBy.includes(user.uid),
        };
      });
      setMessages(messages);
    });
    return unsubscribe;
  }, [db, query.isReady, user]);

  const ChatOpenhandle = async () => {
    const unreadMessages = messages.filter((message) => message.sender !== user.uid && !message.read);
    const batch = writeBatch(db);
    unreadMessages.forEach((message) => {
      const messageRef = doc(db, "chats", message.id);
      batch.update(messageRef, {
        readBy: [...message.readBy, user.uid],
      });
    });
    await batch.commit();
    setShowChat(true)
    setHidebehindButtonChat(true)
  }
  const readfilter = messages.filter((message) => message.sender !== user.uid && !message.read)
  const isOpenScreen = useSelector((state) => state.screenShareModal.isShare);
  return (
    <div className="unity-scene-spaces">
      <Toaster />
      
      <div className='SidebarBox-unity-top-right'>
        <Chat open={showChat} close={chatHandle} />
      </div>

      <div className="screen-container"  style={{ opacity: isOpenScreen ? '1' : '0' }}>
       {children[1]}
      </div>
      <div className='SidebarBox-unity-top-left'>
        <motion.div
          variants={sidebarVariants}
          animate={videoCam ? "sidebarOpen" : "sidebarClosed"}
          className='sidbarBoxunity sidbarBoxunity-border'>
          <div className="sidebar-container">
            {
              agoraShow ?
                children[0]
                : ''
            }

          </div>
          <div className="sidebar-container">
            <div className="sidebar-button-submit">
              <button onClick={() => closedModalsidebar('openVideo')} className="sidebar-button">done</button>
            </div>
          </div>
        </motion.div>
        {/* <VideoSidebar  username={pathName} pathId={pathId} open={buttons.videoCam} closedModal={() => closedModalsidebar('openVideo')} /> */}
      </div>

      {ismodal &&
        <div className="newSpace">
          <Addcontent action={openModal} Urldata={(urlData) => setUrlData(urlData)} spaceId={query.query.id} />
        </div>}
          {/* loading[loading.length -1] &&  */}
          <div className="unity-interaction-container">
            <div className="unity-interactions">
              {
                <div className="unity-leave" style={{ opacity: hidebehindButtonVideo ? '0' : '1' }}>
                  <div className="unity-flex-child-leave cursor-pointer"
                    onClick={leavehandle}>
                    <span style={{ transform: 'rotate(180deg)' }}><IoExitOutline /></span>Exit
                  </div>

                </div>
              }

              <div className="unity-people">
                <div className="unity-flex-child">
                  <div className="unity-people-after" style=
                    {{
                      width: query.query.type === 'explore' ? 'max-content' : '100%'
                    }}>
                    {
                      query.query.type === 'spaces' ?


                        <form onSubmit={submitInput}>
                          <input
                            style={{ width: `${inputName.length}ch`, textAlign: 'center' }}
                            onChange={nameHandle}
                            value={inputName}
                            type="text"
                          />
                        </form>

                        : query.query.name
                    }
                    {
                      query.query.type === 'spaces' &&
                      <span className="unity-people-pencil" style={{ width: `${inputName.length}ch` }}><BiPencil /></span>
                    }


                  </div>


                  <div className="bg-info rounded-circle image-space unity-avatar-border" onClick={agoraControl}>
                    {
                      user?.photoUrl ?
                        <Image className="space-avtar-img" src={user?.photoUrl ? user?.photoUrl : '/images/login-images/thumbnail.png'} priority={true} layout='fill' alt="avatarImages" />
                        :
                        <Image src='/images/login-images/thumbnail.png' priority={true} layout='fill' alt="thumbnailImages" />
                    }
                  </div>
                </div>
                {
                  agoraUsermodal && <Agorausermodal close={agoraControl} />
                }
              </div>
              <div className="unity-like">
                <div className="unity-flex-child" style={{ opacity: hidebehindButtonChat ? '0' : '1' }}>
                  <div className="like">
                    <span className={buttons.like ? "like-red" : ''} onClick={likeHandle}>
                      {
                        buttons.like ? <AiFillHeart /> : <AiOutlineHeart />
                      }
                    </span> {buttons.count}
                  </div>
                  <div className="camera unity-hover" data-name={"screenshot"} onClick={captureImage}>
                    <RiCameraFill />
                  </div>
                  <div onClick={copy} style={{ fontSize: '17px' }} className="camera unity-hover" data-name={!copied ? "Copy link" : "Copied!"} >
                    <BsShare />
                  </div>
                </div>
              </div>
            </div>

            <div className="unity-interactions">
              <div className="unity-leave" onClick={() => micHandle('video')}>
                <div className="unity-flex-child" style={{ opacity: hidebehindButtonVideo ? '0' : '1' }}>
                  <span>Stream</span> <span className="exit-rotate-unity"><AiOutlineDeploymentUnit /> </span>
                </div>
                {/* <div onClick={() => micHandle('video')} data-name={buttons.videoCam ? 'Turn of camera' : 'Turn on camera'} className="unity-flex-child unity-hover">
              { videoCam ?  <BsCameraVideo /> :<BsCameraVideoOff/> }
              </div>  */}
              </div>
              <div className="unity-control">
                {
                  query.query.type === 'explore' ?
                    <div className="unity-flex-child">
                      <span><AiOutlineLeft /></span>
                      <span className="unity-play" onClick={playHandle}>
                        {
                          buttons.play
                            ?
                            <GiPauseButton />
                            :
                            <FiPlay />
                        }
                      </span>
                      <span><AiOutlineRight /></span>
                    </div>
                    : <div className="unity-bottom-center-flex" style={{ opacity: 0 }}>
                      <div
                        onClick={() => setButtons(prev => (
                          {
                            ...prev,
                            open: !buttons.open
                          }
                        ))
                        }
                        className="unity-bottom-center unity-hover cursor-pointer" data-name="Sticky note Coming soon"><MdOutlineSpeakerNotes /></div>
                      <div onClick={searchhandle} className="unity-bottom-center unity-hover cursor-pointer" data-name="Search or URL Coming soon"><AiOutlineSearch /></div>
                      <div onClick={openModal} className="unity-bottom-center unity-hover cursor-pointer" data-name="Add content" style={{ backgroundColor: '#28f' }}><MdAdd /></div>
                      <div className="unity-bottom-center unity-hover cursor-pointer" data-name="Add portal Coming soon"><GiPortal /></div>
                      <div className="unity-bottom-center unity-hover cursor-pointer" data-name="Share screen Coming soon"><MdOutlineScreenShare /></div>
                    </div>
                }
              </div>
              <div className="unity-help">
                <div className="unity-flex-child" style={{ opacity: hidebehindButtonChat ? '0' : '1' }}>

                  <div className={directionModal ? "unity-bottom-center" : "unity-bottom-center unity-hover"} data-name="Help" onClick={directionModalHandle}><BiDirections /></div>
                  <div className={isOpenScreen ? "unity-bottom-center" : "unity-bottom-center unity-hover"} data-name="Screen Share" onClick={() => dispatch(openScreenModal())}><MdOutlineScreenShare /></div>
                  <div onClick={ChatOpenhandle} className="unity-bottom-center unity-hover" data-name="Chat"><BsChat />
                    {readfilter.length > 0 &&
                      <span className="chat-notifications-count"></span>
                    }
                  </div>

                  <span><BiDotsHorizontalRounded /></span>
                </div>
                {directionModal && <Directionmodal close={directionModalHandle} />}
              </div>
            </div>
          </div>
        
      {/* } */}
    
   




      <div className="unity-scene">
         {enviroment}
      </div>

    </div>

  )
}
export const UnityEnviroment = () => {
  const capture = useSelector((state) => state.capture.capture);
  const { user } = useAuth()
  const query = useRouter()
  const {
    unityProvider,
    sendMessage,
    loadingProgression,
    isLoaded,
    initialisationError,
    takeScreenshot,
    onProgress,
    onMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "/Build/Build.loader.js",
    dataUrl: "/Build/Build.data",
    frameworkUrl: "/Build/Build.framework.js",
    codeUrl: "/Build/Build.wasm",
    webglContextAttributes: {
      preserveDrawingBuffer: true,
    },
    cacheControl: handleCacheControl,
  });
  const loading = Math.round(loadingProgression * 100)

  if (capture[capture.length - 1] === true) {
    const dataUrl = takeScreenshot("image/jpg", 1.0);
    saveAs(dataUrl, 'image.jpg') // Put your image url here.
    console.log('ok')
  }



  const EnvironmentLoader = () => {
    sendMessage("GameController", "SelectModel", query.query.numb);
    // sendMessage("GameController", "Turnoffkeyboard");

  }
  function handleCacheControl(url) {
    console.log(`Cache control for ${url}`);
    return "no-cache";
  }




  // const ModelLoader = () => {
  //   const unityData = { id: query.query.id, type: 'spaces', }
  //   const unityJson = JSON.stringify(unityData)
  //   sendMessage("ModelLoader", "OtherModel", unityJson);
  //   sendMessage("FileLoader", "OtherFiles", unityJson);

  // }


  // const CreateAndJoinRooms = () => {
  //   const unityData = { roomID: query.query.id, playerID: user.uid }
  //   const unityJson = JSON.stringify(unityData)
  //   sendMessage("CreateAndJoinRooms", "GetRoomData", unityJson);
  // }


  if (isLoaded && capture.length === 0) {
    EnvironmentLoader()
  }
 


    return (
      <Fragment>
        {!isLoaded && (
          <Unityloader loading={loading} envirometname={query.query.name} />
        )}

        < Unity
          unityProvider={unityProvider}
          tabIndex={1}
          style={{ visibility: isLoaded ? "visible" : "hidden", width: '100%', height: '100%', overflow: 'hidden' }}
        />

      </Fragment>
    )
}





const Wrapper = () => {
  const App = dynamic(import('../../component/video-call/Agora'), { ssr: false });
  const query = useRouter()
  const AppMemo = memo(App);
  const UnityEnviromentMemo = memo(UnityEnviroment)
  const ScreenApp = dynamic(import('../../component/video-call/ScreenShare'), { ssr: false });
  const ScreenMemo = memo(ScreenApp);



  return (
    <Unitypage enviroment={<UnityEnviromentMemo />} >
      <AppMemo channelName={query.query.id}  />
      <ScreenMemo />
    </Unitypage>
  )



}
export default Wrapper
