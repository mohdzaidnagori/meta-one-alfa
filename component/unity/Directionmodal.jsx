import React from 'react'
import { motion } from 'framer-motion'
import { IoCloseSharp } from 'react-icons/io5';
import Image from 'next/image';

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
    <div className="agora-user-container" style={{overflow:'hidden'}}>
      <div className="row gx-3 agora-direction-container">
        <div className="col-6 direction-button-1" style={{height:'90px'}}>
        </div>
        <div className="col-6 direction-button-2" style={{height:'90px'}}>
        </div>
        <div className="col-12 text-center">Avatar Move
        </div>
        <div className="col-6 direction-button-3" style={{height:'90px'}}>
        </div>
        <div className="col-6 direction-button-4" style={{height:'90px'}}>
        </div>
      </div>
        
    </div>
 </motion.div>
  )
}

export default Directionmodal