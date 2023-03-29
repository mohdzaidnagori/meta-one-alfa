import { useRouter } from 'next/router';
import React from 'react'
import { Fragment } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Unityloader } from '../../component/loader/Unityloader';

const Demo = () => {
const query = useRouter()
    const {
        unityProvider,
        sendMessage,
        loadingProgression,
        isLoaded,
    } = useUnityContext({
        loaderUrl: "/Build/build.loader.js",
        dataUrl: "/Build/build.data",
        frameworkUrl: "/Build/build.framework.js",
        codeUrl: "/Build/build.wasm",
    });
    const loading = Math.round(loadingProgression * 100)
    const EnvironmentLoader = () => {
        sendMessage("GameController", "SelectModel", query.query.num);
        // sendMessage("GameController", "Turnoffkeyboard");
    }
 console.log(query.query.num)
    if (isLoaded) {
      EnvironmentLoader()
    }

    return (
        <Fragment>
            {!isLoaded && (
                <Unityloader loading={loading} envirometname={query.query.name} />
            )}

            < Unity
                unityProvider={unityProvider}
                tabIndex={1}
                style={{ visibility: isLoaded ? "visible" : "hidden", width: '100%', height: '100%', overflow: 'hidden' }}
            />

        </Fragment>
    )
}
export default Demo