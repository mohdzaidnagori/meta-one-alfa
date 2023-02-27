import { doc, setDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { 
    auth,
    onAuthStateChanged,
    db,
} from '../../firebase'
import Loader from '../loader/Loader'
const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)


export const AuthContextProvider = ({children}) => {


    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          const data = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
            emailVerified:user.emailVerified
          }
          setDoc(doc(db,'users',user.uid),data,{ merge:true })
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL ? user.photoURL : 'https://lh3.googleusercontent.com/a-/ACNPEu_kKu4xWrTuZqCXyvwgWDvoGlXBDNnuzrns8cCe=s96-c',
            emailVerified:user.emailVerified
          })
          
        } else {
          setUser(null)
        }
        setLoading(false)
      })
  
      return () => unsubscribe()
    }, [])



  
 
    
      return (
        <AuthContext.Provider value={{ user}}>
          {loading ? <Loader /> : children}
        </AuthContext.Provider>
      )
}