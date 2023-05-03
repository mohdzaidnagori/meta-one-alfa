import React from 'react'
import { Fragment } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Unityloader } from '../../component/loader/Unityloader';
import { useAuth } from '../../component/router/AuthContext';

const Avtar = () => {
  const { user } = useAuth()
  const { unityProvider,sendMessage,loadingProgression, isLoaded} = useUnityContext({
    loaderUrl: "/Build/avatar/avatar.loader.js",
    dataUrl: "/Build/avatar/avatar.data",
    frameworkUrl: "/Build/avatar/avatar.framework.js",
    codeUrl: "/Build/avatar/avatar.wasm",
  });
  const loading = Math.round(loadingProgression * 100)
  const EnvironmentLoader = () => {
    sendMessage('GetUserID','Userdata', user.uid);

  }
  if(isLoaded){
    EnvironmentLoader()
    console.log(user.uid)
  }

  return ( 
    <Fragment>
    {!isLoaded && (
          <Unityloader loading={loading} envirometname={user.displayName}  />
           )}
          
          <Unity
          unityProvider={unityProvider}
          style={{ visibility: isLoaded ? "visible" : "hidden",width:'98vw',height:'99vh',overflow:'hidden' }}
          />
    </Fragment>
  )
}

export default Avtar