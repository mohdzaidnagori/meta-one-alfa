import React, { Fragment } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Unityloader } from '../../component/loader/Unityloader';
import { useAuth } from '../../component/router/AuthContext';

const Meta = () => {
    const {
        unityProvider,
        sendMessage,
        loadingProgression,
        isLoaded,
        unload
      } = useUnityContext({
        loaderUrl: "/Build/EniverBuild.loader.js",
        dataUrl: "/Build/EniverBuild.data",
        frameworkUrl: "/Build/EniverBuild.framework.js",
        codeUrl: "/Build/EniverBuild.wasm",
      });

  const loading = Math.round(loadingProgression * 100)
  const { user } = useAuth()

  const EnvironmentLoader = () => {
    const unityData = { id: 'v0qkneychmlRlMPqBCIY', type: 'spaces',playerName:user.id }
    const unityJson = JSON.stringify(unityData)
    sendMessage("EnvironmentLoader", "MainModel", unityJson);
  }
  if(isLoaded){
    EnvironmentLoader()
  }





//   const handleClickUnload = async () => {
//     if (isLoaded === false) {
//       return;
//     }
//     try {
//       await unload();
//       console.log("Unload success");
//     } catch (error) {
//       console.error(`Unable to unload: ${error}`);
//     }
//   };




  return (
    <Fragment>
    {!isLoaded && (
          <Unityloader loading={loading} envirometname={user.displayName}  />
           )}
          
          <Unity
          unityProvider={unityProvider}
          style={{ visibility: isLoaded ? "visible" : "hidden",width:'100vw',height:'99vh',overflow:'hidden' }}
          />
             {/* <button style={{position:'relative',zIndex:'1000',top:'0',width:'100px',height:'100px'}} onClick={handleClickUnload}>Unload</button> */}
    </Fragment>
  )
}

export default Meta