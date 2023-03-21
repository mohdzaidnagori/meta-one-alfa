import dynamic from 'next/dynamic';
import React from 'react'
import { memo } from 'react';

const Testagora = () => {
    const App = dynamic(import('../../component/video-call/ScreenShare'), { ssr: false });
    const AppMemo = memo(App);
  return (
    <div><AppMemo /></div>
  )
}

export default Testagora