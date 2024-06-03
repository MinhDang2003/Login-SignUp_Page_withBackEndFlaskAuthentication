import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

import {axiosPublic} from '../api/axios';
import  axios,{ AxiosError} from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const WebcamCapture = () => {
 
  const [errorMessage, setErrorMessage] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [verifying, setVerifying ] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const startCapture = React.useCallback(() => {
    setImages([])
    setCapturing(true);
    const intervalId = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImages(prevImages => [...prevImages, imageSrc]);
      }
    }, 20); // Capture image every second

    setTimeout(async() => {
      clearInterval(intervalId);
      setCapturing(false);
      // Reset images array after sending to the server
      //setImages([]);
      // Send all the images to the server
      try {
        const response = await axiosPrivate.post('/api/getTrainImgs', { img_arr : images });
        console.log(response?.data)
        setErrorMessage("");

      } catch(error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status === 400) {setErrorMessage(axiosError.response?.data?.msg);}
            console.error(axiosError)
        }
        
      }
      
    }, 1000); // Stop capturing after 15 seconds

    //setImages([])
  }, [webcamRef,axiosPrivate,images]);

  

  const verify = React.useCallback(() => {
    setVerifying(true);
    const intervalId = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImages([imageSrc]);
      }
    }, 1); // Capture image every second

    setTimeout(async() => {
      clearInterval(intervalId);
      setVerifying(false);
      // Send all the images to the server
      try {
        const response = await axiosPrivate.post('/api/verification', { input_img : images });
        console.log("ok")
        console.log(response?.data)
      } catch(error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(axiosError)
        }
        
      }
    }, 1000); // Stop capturing after 15 seconds
  }, [webcamRef]);
  

  return (
    <div className="flex flex-col items-center justify-center">
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-full" />
      <button onClick={startCapture} className={`mt-4 p-2 bg-blue-500 text-white rounded ${capturing ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={capturing}>
        {capturing ? 'Capturing...' : 'Capture photos'}
      </button>
      <button onClick={verify} className={`mt-4 p-2 bg-blue-500 text-white rounded ${verifying ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={verifying}>
        {capturing ? 'Verifying...' : 'Verify'}
      </button>
      {errorMessage && <p className='text-base pl-1 pb-4 text-red-600 font-sans'>{errorMessage}</p>}
    </div>
  );
};

export default WebcamCapture;