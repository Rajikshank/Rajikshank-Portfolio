import { motion } from 'motion/react'
import React from 'react'

const Modal = ({src}:{src:string}) => {
  
  
    return (
    <motion.div initial={{scale:0 ,y:100}} animate={{scale:1,y:0}} transition={{delay:0.15, }} className='absolute  rounded-md -top-55 -right-40 w-[450px] h-[200px] shadow-lg shadow-orange-500 bg-white '>
        <img src={src} className='w-full rounded-md'/>
    </motion.div >
  )
}

export default Modal