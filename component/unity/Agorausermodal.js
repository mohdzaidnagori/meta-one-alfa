import { motion } from 'framer-motion'
import Image from 'next/image';
import React from 'react'
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { IoCloseSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';

const Agorausermodal = ({close}) => {
  const agoraUser = useSelector((state) => state.users.users[state.users.users.length -1]);
    const dropIn = {
        hidden: {
          scale:0.8,
          opacity: 0,
        },
        visible: {
          scale:1,
          opacity: 1,
          transition: {
            default: {
              duration: 0.1,
              ease: [0, 0.71, 0.2, 1.01]
            },
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
            }
          },
        },
        exit: {
          y: "100vh",
          opacity: 0,
        },
      };
  return (
    <motion.div
    className="modal-agora-open"
    // style={{height:'200px'}}
    variants={dropIn}
    initial="hidden"
    animate="visible"
    exit="exit"
    >
    <div className="close-agora-modal">
        <IoCloseSharp onClick={close} />
    </div>
    <div className="agora-user-container">
        {
        agoraUser?.map((user) => {
          // let text = user.uid
          // const str = text.split("cutdata")
          return (
            // <p key={user.uid}><span>{user.uid} </span><span>{user.audio ? 'true' : 'false'}</span> <span>{user.video ? 'true' : 'false'}</span></p>
            <div className="agora-user" key={user.uid}>
            <div className="bg-info rounded-circle image-space unity-avatar-border-black">
              {
                 <Image src={'/images/login-images/thumbnail.png'}  priority={true} layout='fill'  alt="thumbnailImages" />
              }
           </div>
           <div>{user.uid}</div>
           <div>{user.audio ? <BsFillMicFill /> : <BsFillMicMuteFill />}</div>
           <div>{user.video ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}</div>
        
         </div>
          )
        })
      }
    </div>
 </motion.div>
  )
}

export default Agorausermodal