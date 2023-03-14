import React, { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import Image from 'next/image';
import { addDoc, collection, getDocs, limitToLast, onSnapshot, orderBy, serverTimestamp, Timestamp, where } from "firebase/firestore";
import { query as fireQuery } from "firebase/firestore";

import { useAuth } from '../router/AuthContext';
import { BiSend } from 'react-icons/bi';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../firebase';
import { IoArrowForwardOutline } from 'react-icons/io5';


const Chat = ({ open, close }) => {
  const [msg, setMsg] = useState("")
  const [getData, setGetData] = useState([])
  const { user } = useAuth()
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
  const query = useRouter()
  const ref = useRef(null);

  const handleSubmit = async () => {

    if (msg === '') {
      return
    }
    else {
      try {
        const docRef = await addDoc(collection(db, "chats"), {
          spaceId: query.query.id,
          text: msg,
          username: user.displayName,
          sender: user.uid,
          readBy: [],
          timestamp: serverTimestamp()
        });
        ref.current.scrollTo({
          top: document.documentElement.scrollHeight * 60,
          behavior: 'smooth',
        });
        console.log("Document written with ID: ", docRef.id);

      } catch (e) {
        console.error("Error adding document: ", e);
      }
      setMsg('')
    }
  }


  useEffect(() => {
    ref.current.scrollTo({
      top: document.documentElement.scrollHeight * getData.length,
      behavior: 'smooth',
    });
    console.log(getData.length+'useeffecet run')
  }, [getData,open])
  useEffect(() => {
    if (!query.isReady) return;
    console.log(query.isReady)
    const spacehandle = async () => {
      const q = fireQuery(collection(db, "chats"), where("spaceId", "==", query.query.id), orderBy("timestamp", "asc"), limitToLast(50));
      const unsub = onSnapshot(
        q,
        (snapShot) => {
          let list = [];
          snapShot.docs.forEach((doc) => {
            list.push({
              listid: doc.id,
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
    // return () => unsub
  }, [query.isReady])
  function convertDate(time) {
    //time should be server timestamp seconds only
    let dateInMillis = time * 1000
    let date = new Date(dateInMillis)
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let myDate = date.toLocaleDateString('en-us', options)
    let myTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return myDate + " " + myTime
  }
  const handleKeypress = e => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleSubmit();
    }
  };
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
            animate="open">
            <div className="chat-header">
              <div className="closed-chat-left">
                <span> <IoArrowForwardOutline onClick={close} /></span>
              </div>
              <div className="bg-info rounded-circle image-space" style={{ border: '2px solid #fff' }}>
                {
                  <Image src={user?.photoUrl}
                    priority={true}
                    layout='fill'
                    alt="thumbnailImages"
                  />
                }
              </div>
              <div className="chat-username">
                <h4>{user.displayName}</h4>
              </div>
            </div>
            <div className="chat-input-box">
              <input
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
                type="text"
                placeholder='Enter your Message Here'
                onKeyDown={handleKeypress}
                tabIndex={2}
              />
              <span onClick={handleSubmit}><BiSend /></span>
            </div>
            <div ref={ref} className="msg-container infinite-scroll-div-chat">
              {open &&
                getData.map((item) => {
                  if (item.username !== user.displayName) {
                    return (
                      <div className="chat-msg-box" key={item.listid} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div className='msg-box msg-box-right'>
                          <p className='chat-msg-user'>{item.username}</p>
                          <p>{item.text}</p>
                          <p className='chat-msg-date'>{convertDate(item.timestamp?.seconds)}</p>
                        </div>
                      </div>
                    )
                  }
                  else {
                    return (
                      <div className="chat-msg-box" key={item.listid} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className='msg-box msg-box-left'>
                          <p className='chat-msg-user'>You</p>
                          <p>{item.text}</p>
                          <p className='chat-msg-date'>{convertDate(item.timestamp?.seconds)}</p>
                        </div>
                      </div>
                    )
                  }

                })
              }
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default Chat
