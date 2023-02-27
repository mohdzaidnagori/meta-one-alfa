import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../component/router/AuthContext";
import { HiOutlineMail } from "react-icons/hi";
import { MdOutlineMarkEmailRead } from 'react-icons/md'
import { auth } from "../../firebase";

const Verified = () => {
  const [calledPush, setCalledPush] = useState(false)
  const { user } = useAuth()
  setTimeout(() => {
    window.location.reload()
  },3000)

  console.log(user?.emailVerified)
  useEffect(() => {
    if (user.emailVerified) {
      router.push('/spaces')
    }
    else{
      router.push('verified')
    }
  }, [])
  const router = useRouter()

 



  const verifiedElement = () => {
    return (
      <div style={{height:'95vh',display:'grid',placeItems:'center', overflow: 'hidden'}}>
        <div className="email-verified-flex">
        <span>{user.emailVerified ? <MdOutlineMarkEmailRead />: <HiOutlineMail />}</span>
          <h5>Your email is {user.emailVerified ? '' : 'not'} verified</h5>
          <p>your confirmation message send to your email : <span>{user.email}</span></p>
          {
            user.emailVerified && <button onClick={() => router.push('/spaces')}>Go to spaces</button>
          }
        </div>
      </div>
    )
  }
  return (
    <>
      {

        <div className="verified-mes">

          {verifiedElement()}
        </div>
      }
      <style jsx>
        {`
.verified-mes{
    display:flex;
    justify-content:center;
    margin-top:30px;
}
      `}
      </style>
    </>
  )
}

export default Verified
