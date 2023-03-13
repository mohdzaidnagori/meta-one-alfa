import { useEffect } from 'react'
import { useState, useRef, createContext, useContext } from 'react'
// import { useDispatch } from 'react-redux'
// import { AddUser } from '../redux/CounterSlice'

const UserContext = createContext()
const StartContext = createContext()
const ClientContext = createContext()
const SpeakingContext = createContext()



export const useUsers = () => {
    return useContext(UserContext)
}


export const useStart = () => {
    return useContext(StartContext)
}


export const useClient = () => {
    return useContext(ClientContext)
}

export const useSpeaking = () => {
    return useContext(SpeakingContext)
}



export const GlobalProvider = ({ children }) => {

    const [users, setUsers] = useState([])
    const [start, setStart] = useState(false)
    // const [viduser,setViduser] = useState([{}])
     // }
    //  const dispatch = useDispatch();
    //  useEffect(() => {
        
    //     if(users.length != 0){
    //         console.log(users)
    //         const uservl = {
    //             audio:users.audio,
    //             video:users.video
    //         }
    //        dispatch(AddUser(uservl));
    //     }
    //  },[users.length])

    
    const rtc = useRef({
        // For the local client.
        client: null,
        // For the local audio and video tracks.
        localAudioTrack: null,
        localVideoTrack: null,
        checkSpeakingInterval: null,
        screenTrack:null
    });
    const [speaking, setSpeaking] = useState(false)
    return (
        <SpeakingContext.Provider value={[speaking, setSpeaking]}>
            <ClientContext.Provider value={rtc}>
                <UserContext.Provider value={[users, setUsers]}>
                    <StartContext.Provider value={[start, setStart]}>
                        {children}
                    </StartContext.Provider>
                </UserContext.Provider>
            </ClientContext.Provider>
        </SpeakingContext.Provider>
    )
}
