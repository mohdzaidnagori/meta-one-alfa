import React, { useState } from 'react'

const Xxx = () => {
    const [element,setElement] = useState(['z','a','i','d','e','f','g'])
const hadlearrayPostion = (index) => {
    const newArray = [...element];
    const clickedItem = newArray.splice(index, 1)[0];
    newArray.unshift(clickedItem);
    setElement(newArray);
}
console.log(element)
  return (
    <div className='main-body'>
        <div className="xxx-main-conatiner">
        <div className="row">
                {
                    element.map((item,index) => {
                    
                       return (
                                index === 0 ? 
                                <div key={index} className="col-md-12" style={{height:'600px',background:'red'}}>{item}</div>
                                :
                                <div key={index} onClick={() => hadlearrayPostion(index)} className="col-md-2" style={{height:'100px',background:'green'}}>{item}</div>
                       )
                    })
                }
             
             </div>
        </div>
    </div>
  )
}

export default Xxx