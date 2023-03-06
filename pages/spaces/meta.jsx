import React, { Fragment } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Unityloader } from '../../component/loader/Unityloader';
import { useAuth } from '../../component/router/AuthContext';

const meta = () => {
    const {
        unityProvider,
        sendMessage,
        loadingProgression,
        isLoaded,
      } = useUnityContext({
        loaderUrl: "/Build/Build.loader.js",
        dataUrl: "/Build/Build.data",
        frameworkUrl: "/Build/Build.framework.js",
        codeUrl: "/Build/Build.wasm",
      });

  const loading = Math.round(loadingProgression * 100)
  const { user } = useAuth()
  const EnvironmentLoader = () => {
    const unityData = { id: 'v0qkneychmlRlMPqBCIY', type: 'spaces' }
    const unityJson = JSON.stringify(unityData)
    sendMessage("EnvironmentLoader", "MainModel", unityJson);
  }

  const CreateAndJoinRooms = () => {
    const unityData = { roomID: '0CfgS2PuBNimmQvmCTz3', playerID: user.uid }
    const unityJson = JSON.stringify(unityData)
    sendMessage("CreateAndJoinRooms", "GetRoomData", unityJson);
  }
  if(isLoaded){
    CreateAndJoinRooms()
  }










  return (
    <Fragment>
    {!isLoaded && (
          <Unityloader loading={loading} envirometname={user.displayName}  />
           )}
          
          <Unity
          unityProvider={unityProvider}
          style={{ visibility: isLoaded ? "visible" : "hidden",width:'100vw',height:'99vh',overflow:'hidden' }}
          />
    </Fragment>
  )
}

export default meta