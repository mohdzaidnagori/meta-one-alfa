import { useState, useRef, createContext, useContext } from 'react'


const UserContext = createContext()
const StartContext = createContext()
const ClientContext = createContext()




export const useShareUsers = () => {
    return useContext(UserContext)
}


export const useShareStart = () => {
    return useContext(StartContext)
}


export const useShareClient = () => {
    return useContext(ClientContext)
}





export const GlobalShare = ({ children }) => {

    const [users, setUsers] = useState([])
    const [start, setStart] = useState(false)

  console.log(users)
    
    const rtc = useRef({
        // For the local client.
        client: null,
        // For the local audio and video tracks.
        localAudioTrack: null,
        localVideoTrack: null,
        localScreenTrack:null
    });
    return (
            <ClientContext.Provider value={rtc}>
                <UserContext.Provider value={[users, setUsers]}>
                    <StartContext.Provider value={[start, setStart]}>
                        {children}
                    </StartContext.Provider>
                </UserContext.Provider>
            </ClientContext.Provider>
    )
}