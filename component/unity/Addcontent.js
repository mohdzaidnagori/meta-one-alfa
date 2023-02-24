import React, { useState } from 'react'
import { motion } from "framer-motion";
import { AiOutlineClose } from 'react-icons/ai';
import Filedragdrop from './Filedragdrop';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { AddNote,DeleteNote } from "../redux/CounterSlice";
import { BiTime } from 'react-icons/bi';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Image from 'next/image';
import { SiUnity } from "react-icons/si";

const Addcontent = ({action,spaceId,Urldata}) => {
    const [ToggleState, setToggleState] = useState(1);
    const [showFileData,setShowFileData] = useState(null)
    const [showObjData,setShowObjData] = useState(null)
    const [BlobData,setBlobData] = useState('')
    const router = useRouter()
    const toggleTab = (index) => {
      setToggleState(index);
    };
      const getActiveClass = (index, className) => {
          return ToggleState === index ? className : "";
      }
     

    const dropIn = {
        hidden: {
          scale:0.7,
          opacity: 0,
        },
        visible: {
          scale:1,
          opacity: 1,
          transition: {
            default: {
              duration: 0.1,
              ease: [0, 0.71, 0.8, 1]
            },
            scale: {
              duration: 0.2, type: "tween"
            }
          },
        }
      };
      // const getUrl = (res) => {
      //   Urldata(res)
      // }
      const dispatch = useDispatch();
      // const onUpload = async (files) => {
      //   const modalLoader = {
      //     id:'loading',
      //     url:'loading',
      //     type:'loading'
      //   }
      //   dispatch(AddNote(modalLoader));
      //   toast.success('uploading...')
      //   var allowedExtensions =/(\.glb)$/i;
      //   if(!allowedExtensions.exec(files.name)){
      //   const url = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/addSpaceFiles`
      //   const data = new FormData()
      //   data.append('file',files)
      //   data.append('spaceId',spaceId)
      //   data.append('name','files')
      //   data.append('position',"{x:0.y:0.z:0}")
      //   data.append('rotation','{x:0.y:0.z:0}')
      //   data.append('scale','{x:1.y:1.z:1}')
      //   data.append('type','files')
      //   console.log('add files')
        
      //   await axios.post(url,data,{
      //     headers: {
      //       'Content-Type': 'multipart/form-data'
      //       }
      //   })
      //   .then(function (response) {
      //       //handle success
      //       toast.success('successfully upload')
      //       console.log(response.data.url)
      //       let match = 'any' 
      //       match = response.data.url.match(/.jpg|.jpeg|.png|.webp|.avif|.gif|.mp4|.svg/)
      //       console.log(match[0])
      //       // let videomatch = response.data.url.match(/.mp4|.mkv|.ogg|.mov|.avi|.webm|.flv/)
      //       if(match[0] === '.jpg' || match[0] === '.jpeg' || match[0] === '.png' || 
      //       match[0] === '.webp' || match[0] === '.avif' || match[0] === '.gif' || match[0] === '.svg'){
      //          dispatch(DeleteNote())
      //         const modalImg = {
      //           id:response.data.id,
      //           url:response.data.url,
      //           type:'img'
      //         }
      //         dispatch(AddNote(modalImg));
      //       }
      //       else if(match[0] === '.mp4'){
      //         dispatch(DeleteNote())
      //         const modalVideo = {
      //           id:response.data.id,
      //           url:response.data.url,
      //           type:'video'
      //         }
      //         console.log('video')
      //         dispatch(AddNote(modalVideo));
      //       }
      //     })
      //     .catch(function (response) {
      //       //handle error
      //       toast.error('enexpected error' +response)
      //     });
      //   }
      //   else{  
      //   const url = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/addSpaceObject`
      //   const data = new FormData()
      //   data.append('file',files)
      //   data.append('spaceId',spaceId)
      //   data.append('name','zaid House')
      //   data.append('position',"{x:0.y:0.z:0}")
      //   data.append('rotation','{x:0.y:0.z:0}')
      //   data.append('scale','{x:1.y:1.z:1}')
      //   data.append('type','modal')
        
      //   await axios.post(url,data,{
      //     headers: {
      //       'Content-Type': 'multipart/form-data'
      //       }
      //   })
      //   .then(function (response) {
      //       //handle success
      //      toast.success('successfully modal upload')
      //      console.log(response)
       
      //     const modalGlb = {
      //       id:response.data.id,
      //       url:response.data.url,
      //       type:'glb'
      //     }
      //     dispatch(AddNote(modalGlb));
           
      //     })
      //     // .catch(function (response) {
      //     //   //handle error
      //     //   toast.error('enexpected error' +response)
      //     // });
      //   }
       
      // };



      const getBase64FromUrl = async (url) => {
        console.log('base')
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve, reject) => {
          var reader  = new FileReader();
          reader.addEventListener("load", function () {
              resolve(reader.result);
          }, false);
      
          reader.onerror = () => {
            return reject(this);
          };
          reader.readAsDataURL(blob);
        })
      }
      const res = async (File) => {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.pdf)$/i;
        if(allowedExtensions.exec(File?.name)[0] === '.pdf'){
                const url = `https://v2.convertapi.com/convert/pdf/to/png?Secret=PBLL2sgQJNyvgxYm&StoreFile=true`
              console.log('ok')
              const data = new FormData()
              data.append('file',File)
          const response = await axios.post(url,data,{
            headers: {
              'Content-Type': 'multipart/form-data'
              }
          })
          const blobUrl =  await getBase64FromUrl(response.data.Files[0].Url)
          return blobUrl
    
        }
      }


    
      const onUpload =  async (files) => {
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.svg|\.pdf)$/i;
        var allowedExtensionsvideo = /(\.mp4|\.mkv)$/i;
        var allowedExtensionsobj = /(\.glb)$/i;
        const modalLoader = {
              id:'loading',
              url:'loading',
              type:'loading'
            }
            dispatch(AddNote(modalLoader));
        if(allowedExtensions.exec(files.name)){
          const result = await res(files)
          console.log(result)
            toast.success('image uploading...')
            dispatch(DeleteNote())
            const url = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/addSpaceFiles`
            const data = new FormData()
            // result !== '' ? data.append('url',result) : data.append('file',files)
            data.append('file',result)
            data.append('spaceId',spaceId)
            data.append('name',files.name)
            data.append('position',JSON.stringify([0,0,0]))
            data.append('rotation',JSON.stringify([0,0,0]))
            data.append('scale',JSON.stringify([1,1,1]))
            data.append('type','images')

             await axios.post(url,data,{
                  headers: {
                    'Content-Type': 'multipart/form-data'
                    }
              })
              .then((response) => {
                toast.success('successfully image upload')
                dispatch(DeleteNote())
                const modalImg = {
                  id:response.data.id,
                  url:response.data.url,
                  type:'img'
                }
                dispatch(AddNote(modalImg));
                console.log(response)
              })
              .catch((error) => {
                toast.error('enexpected error' +error)
              })
             
            
        }
        else if(allowedExtensionsvideo.exec(files.name)){
          toast.success('video uploading...')
          const url = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/addSpaceFiles`
          const data = new FormData()
          data.append('file',files)
          data.append('spaceId',spaceId)
          data.append('name',files.name)
          data.append('position',JSON.stringify([0,0,0]))
          data.append('rotation',JSON.stringify([0,0,0]))
          data.append('scale',JSON.stringify([1,1,1]))
          data.append('type','video')
           console.log(data)
           

           await axios.post(url,data,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                  }
            })
            .then((response) => {
              toast.success('successfully video upload')
              dispatch(DeleteNote())
              const modalVideo = {
                  id:response.data.id,
                  url:response.data.url,
                  type:'video'
                }
                dispatch(AddNote(modalVideo));
              console.log(response)
            })
            .catch((error) => {
              toast.error('enexpected error' +error)
            })
        }
        else if(allowedExtensionsobj.exec(files.name)){
          toast.success('modal uploading...')
          dispatch(DeleteNote())
          const url = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/addSpaceObject`
            const data = new FormData()
            data.append('file',files)
            data.append('spaceId',spaceId)
            data.append('name',files.name)
            data.append('position',"{x:0.y:0.z:0}")
            data.append('rotation','{x:0.y:0.z:0}')
            data.append('scale','{x:1.y:1.z:1}')
            data.append('type','modal')
            
            await axios.post(url,data,{
              headers: {
                'Content-Type': 'multipart/form-data'
                }
            })
            .then(function (response) {
                //handle success
               toast.success('successfully modal upload')
               console.log(response)
           
              const modalGlb = {
                id:response.data.id,
                url:response.data.url,
                type:'glb'
              }
              dispatch(AddNote(modalGlb));
               
              })
              .catch(function (response) {
                //handle error
                toast.error('enexpected error' +response)
              });
            
        }
    }


      const formats = ['txt','jpg','png','glb']

      const fileGetUrl = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/getSpaceFiles/${router.query.id}/${router.query.type}`
      const objGetUrl = `https://asia-south1-metaone-ec336.cloudfunctions.net/api/getSpaceObjects/${router.query.id}/${router.query.type}`

      useEffect(() => {
        axios.get(fileGetUrl).then((response) => {
          setShowFileData(response.data);
        });
        axios.get(objGetUrl).then((response) => {
          setShowObjData(response.data);
        });
      }, []);
 const allData = showFileData?.concat(showObjData)

  
  return (
    <>
    <Toaster />
    <motion.div
    className="space-modal add-content-modal"
    variants={dropIn}
    initial="hidden"
    animate="visible"
    >
    <div className='add-tabs-container'>
        <button onClick={() => toggleTab(1)} className={`add-tabs-button ${getActiveClass(1,"tabs-button-active")}`}>RECENT</button>
        <button onClick={() => toggleTab(2)} className={`add-tabs-button ${getActiveClass(2,"tabs-button-active")}`}>FILE</button>
        <button onClick={() => toggleTab(3)} className={`add-tabs-button ${getActiveClass(3,"tabs-button-active")}`}>MODAL</button>
        <button onClick={() => toggleTab(4)} className={`add-tabs-button ${getActiveClass(4,"tabs-button-active")}`}>INTEGRATIONS</button>
        <button onClick={() => toggleTab(5)} className={`add-tabs-button ${getActiveClass(5,"tabs-button-active")}`}>UPLOAD</button>
    </div>
    <div className='add-tabs-area-container'>
       <div className={`content ${getActiveClass(1,'active-content')}`}>
        <div className="add-content-container">
        {
            allData?.map((item) => {
              return (
               <div className="image-border-container" key={item?.id}>
                 <div className="imgborder" >
                  {
                    item?.type === 'images'
                    ?
                    <Image src={item?.url}  layout="fill" quality={100} />
                    :
                    item?.type === 'video'
                    ?
                    <video muted  controls style={{width:'100%',height:'100%'}}>
                      <source src={item?.url} />
                    </video>
                    :
                    <div className="unity-3d-icon">
                    <SiUnity />
                    </div>
                    
                  }
                  
                </div>
                {
                  item?.name.length > 13 ? 
                 <p>{item?.name.substring(0,13)}...</p> :  <p>{item?.name}</p>
                }
               </div>
              )
            })
           }
        </div>
       </div>

       <div className={`content ${getActiveClass(2,'active-content')}`}>
        <div className="add-content-container">
           {
            showFileData?.map((item) => {
              return (
               <div className="image-border-container" key={item.id}>
                 <div className="imgborder" >
                  {
                    item?.type === 'images'
                    ?
                    <Image src={item?.url}  layout="fill" quality={100} />
                    :
                    <video muted  controls style={{width:'100%',height:'100%'}}>
                      <source src={item?.url} />
                    </video>
                  }
                  
                </div>
                {
                        item?.name.length > 13 ? 
                        <p>{item?.name.substring(0,13)}...</p> :  <p>{item?.name}</p>
                }
               </div>
              )
            })
           }
        
            
        </div>
       </div>
       <div className={`content ${getActiveClass(3,'active-content')}`}>
        <div className="add-content-container">
        {
            showObjData?.map((item) => {
              return (
               <div className="image-border-container" key={item.id}>
                 <div className="imgborder">
                  <div className="unity-3d-icon">
                  <SiUnity />
                  </div>
                </div>
                {
                        item?.name.length > 13 ? 
                        <p>{item?.name.substring(0,13)}...</p> :  <p>{item?.name}</p>
                }
               </div>
              )
            })
           }
        </div>
       </div>
       <div className={`content ${getActiveClass(4,'active-content')}`}>
        <div className="add-content-container">
          coming soon <span style={{marginLeft:'10px'}}><BiTime /></span>
        </div>
       </div>
       <div className={`content upload ${getActiveClass(5,'active-content')}`}>
          <Filedragdrop
           toggleoff={action}
           onUpload={onUpload}
           count={1}
           formats={formats}
            />
       </div>
    </div>
    <div onClick={action} className="space-modal-close 1"><AiOutlineClose /></div>
    </motion.div>
    </>
  )
}

export default Addcontent






