import React, { useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineKeyboardBackspace, } from 'react-icons/md';
import Image from 'next/image';
import { addDoc, collection, getDocs, onSnapshot, serverTimestamp, Timestamp, where } from "firebase/firestore"; 
import { query as fireQuery } from "firebase/firestore";

import { useAuth } from '../router/AuthContext';
import { BiSend } from 'react-icons/bi';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase';


const Chat = ({ open, close }) => {
  const [msg,setMsg] = useState("")
  const [getData,setGetData] = useState([])
  const { user } = useAuth()
  const router = useRouter()
  const sidebarVariants = {
    sidebarOpen: {
      width: "350px",
    },

    sidebarClosed: {
      width: "0px",
    },
  };
  const itemVariants = {
    sidebarOpen: {
      opacity: 1
    },
    sidebarClosed: { opacity: 0 }
  };
  const handleSubmit = async () => {

    try {
      const docRef = await addDoc(collection(db, "chats"), {
        spaceId: router.query.id,
        username: user.displayName,
        msg:msg,
        timestamp: serverTimestamp()
      });
    
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
     setMsg('')
  }
  useEffect(() => {
    const spacehandle = async () => {

      const q = fireQuery(collection(db, "chats"), where("spaceId", "==", "0CfgS2PuBNimmQvmCTz3"));
      const unsub = onSnapshot(
        q,
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ 
              listid:doc.id,
             ...doc.data() 
  
            });
        });
        setGetData(list);
      },
      (error) => {
        console.log(error);
      }
    );
  
     
    }
    spacehandle()
  },[])
  console.log(getData)
  return (
    <>
        <AnimatePresence>
        <motion.div
        variants={sidebarVariants}
        animate={open ? "sidebarOpen" : "sidebarClosed"}
        className='sidbarBoxunity sidbarBoxunity-border-right'>

        <motion.div
          variants={itemVariants} 
          initial="closed"
          animate="open"
          >
            <div  className="chat-header">
          <div className="closed-chat-left">
            <span> <MdOutlineKeyboardBackspace onClick={close} /></span>
          </div>
          <div className="bg-info rounded-circle image-space" style={{border:'2px solid #fff'}}>
              {
                 <Image src={user.photoUrl}  priority={true} layout='fill'  alt="thumbnailImages" />
              }
           </div>
           <div className="chat-username">
            <h4>{user.displayName}</h4>
           </div>
           </div>
           <div className="chat-input-box">
             <input onChange={(e) => setMsg(e.target.value)} value={msg} type="text" placeholder='Enter your Message Here' />
             <span onClick={handleSubmit}><BiSend /></span>
           </div>
           <div className="msg-container infinite-scroll-div-chat">
             <div className="chat-msg-box" style={{display:'flex',justifyContent:'flex-start'}}>
                 <div className='msg-box msg-box-right'>
                   <p className='chat-msg-user'>Mohd Zaid</p>
                   <p> lorem imsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, blanditiis.</p>
                   <p className='chat-msg-date'>20:08 10 nov 2022</p>
                  </div>
             </div>
             <div className="chat-msg-box" style={{display:'flex',justifyContent:'flex-end'}}>
                 <div className='msg-box msg-box-left'>
                   <p>lo</p>
                   <p className='chat-msg-date'>20:08 10 nov 2022</p>
                  </div>
             </div>
           </div>
        </motion.div>
      </motion.div>
      </AnimatePresence>
    </>
  )
}

export default Chat
