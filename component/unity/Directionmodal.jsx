import React from 'react'
import { motion } from 'framer-motion'
import { IoCloseSharp } from 'react-icons/io5';

const Directionmodal = ({close}) => {
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
    className="modal-direction-open"
    // style={{height:'200px'}}
    variants={dropIn}
    initial="hidden"
    animate="visible"
    exit="exit"
    >
    <div className="close-agora-modal">
        <IoCloseSharp onClick={close} />
    </div>
    <div className="direction-trianle"></div>
    <div className="agora-user-container agora-direction-container">
        <div className="left-side-direction"></div>
        <div className="right-side-direction"></div>
        <div className='direction-heading'>Avatar Move</div>
        <div className="space-jump-direction">Lorem ipsum dolor sit amet.</div>
        <div className="animation-direction">Lorem ipsum dolor sit amet.</div>
    </div>
 </motion.div>
  )
}

export default Directionmodal