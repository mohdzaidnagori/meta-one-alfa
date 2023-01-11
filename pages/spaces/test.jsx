import React from 'react'
import { AnimatePresence, motion, useCycle } from "framer-motion";

const test = () => {
    const [open, cycleOpen] = useCycle(false, true);
    const links = [
        { name: "Home", to: "#", id: 1 },
        { name: "About23df", to: "#", id: 2 },
        { name: "Blog", to: "#", id: 3 },
        { name: "Contact", to: "#", id: 4 }
      ];
    const itemVariants = {
        closed: {
          opacity: 0
        },
        open: { opacity: 1 }
      };

    const sideVariants = {
        closed: {
          transition: {
            staggerChildren: 0.2,
            staggerDirection: -1
          }
        },
        open: {
          transition: {
            staggerChildren: 0.2,
            staggerDirection: 1
          }
        }
      };
  return (
    <div>
      <AnimatePresence>
  {open && (
    <motion.aside
      initial={{ width: 0}}
      animate={{
        width: 300
      }}
     style={{height:'100vh',background:'red'}}
    >
      <motion.div
        className="container"
        initial="closed"
        animate="open"
        exit="closed"
        variants={sideVariants}
      >
        {links.map(({ name, to, id }) => (
          <motion.a
            key={id}
            href={to}
            whileHover={{ scale: 1.1 }}
            variants={itemVariants}
          >
            {name}
          </motion.a>
        ))}
      </motion.div>
    </motion.aside>
  )}
</AnimatePresence>
<div className="btn-container">
  <button onClick={cycleOpen}>{open ? "Close" : "Open"}</button>
</div>
    </div>
  )
}

export default test
