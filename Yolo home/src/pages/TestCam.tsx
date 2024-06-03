import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Sidebar from "../component/Sidebar";
import {axiosPublic} from '../api/axios';
import  axios,{ AxiosError} from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const WebcamCapture = () => {
 
  const [errorMessage, setErrorMessage] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const webcamRef = useRef<Webcam>(null);
  const [countUp, setCountUp] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [isSuccess,setIsSuccess] = useState(false)
  const [verifying, setVerifying ] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [verified,setVerified] = useState(false)
  const [waitVerify,setWaitVerify] = useState(false)
  const startCapture = React.useCallback(() => {
    console.log("Im rendered")
    setCountUp(0)
    setErrorMessage('')
    setImages([])
    setCapturing(true);
    setIsSuccess(false);
    const intervalId = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImages(prevImages => [...prevImages, imageSrc]);
      }
      setCountUp(prevCount => {
        const newCount = prevCount + 1;
        //console.log(newCount); // Log the count here
        return newCount;
      })
      console.log(countUp)
    }, 100); // Capture image every second

    async function sendRequest(attempt = 0) {
      try {
        const response = await axiosPrivate.post('/api/getTrainImgs', { img_arr : images });
        console.log(response?.data);
        setErrorMessage("");
        return response;
      } catch(error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 400) {setErrorMessage(axiosError.response?.data?.msg);}
          console.error(axiosError);
          if (attempt < 1) { // Retry once
            return sendRequest(attempt + 1);
          } else {
            
            throw error; // If the request fails twice, throw the error
          }
        }
      }
    }
    
    setTimeout(async() => {
      clearInterval(intervalId);
      setCapturing(false);
    
      try {
        await sendRequest();
        setIsSuccess(true)
      } catch(error) {
        console.error("Axios request failed after 2 attempts", error);
        setIsSuccess(false)
      }
    
      
      
      console.log("I'm done now");
    }, 1200); // Stop capturing after 15 seconds

    
  }, [webcamRef,axiosPrivate,images,countUp]);

  

  const verify = React.useCallback(() => {
    console.log("Im rendered2")
    setCountUp(0)
    setErrorMessage('')
    setImages([])
    setVerifying(true);
    setVerified(false);
    setWaitVerify(false)
    const intervalId = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImages(prevImages => [...prevImages, imageSrc]);
      }
      setCountUp(prevCount => {
        const newCount = prevCount + 1;
        //console.log(newCount); // Log the count here
        return newCount;
      })
    }, 1000); // Capture image every second

    async function sendRequest(attempt = 0) {
      try {
        const response = await axiosPrivate.post('/api/verification', { input_img : images });
        console.log(response?.data);
        setErrorMessage("");
        return response;
      } catch(error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 400) {setErrorMessage(axiosError.response?.data?.msg);}
          console.error(axiosError);
          if (attempt < 1) { // Retry once
            return sendRequest(attempt + 1);
          } else {
            
            throw error; // If the request fails twice, throw the error
          }
        }
      }
    }
    setTimeout(async() => {
      clearInterval(intervalId);
      setVerifying(false);
    
      try {
        const res = await sendRequest();
        setWaitVerify(true)
        const ver = res?.data?.verified
        console.log(ver)
        if (ver) {
          setVerified(true)
        }
        else {
          setVerified(false)
        }
      } catch(error) {
        console.error("Axios2222 request failed after 2 attempts", error);
        setWaitVerify(false)
      }
    } , 1100
    )
      console.log("I'm done now2");
  }, [webcamRef,axiosPrivate,images]);


  return (
    // <div className="flex flex-col items-center justify-center">
    //   <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-full" />
    //   <button onClick={startCapture} className={`mt-4 p-2 bg-blue-500 text-white rounded ${capturing ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={capturing}>
    //     {capturing ? 'Capturing...' : 'Capture photos'}
    //   </button>
    //   <button onClick={verify} className={`mt-4 p-2 bg-blue-500 text-white rounded ${verifying ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={verifying}>
    //     {capturing ? 'Verifying...' : 'Verify'}
    //   </button>
    //   {errorMessage && <p className='text-base pl-1 pb-4 text-red-600 font-sans'>{errorMessage}</p>}
    // </div>
    

    <div className="flex h-screen w-screen min-h-screen items-start overflow-y-auto">
            <div className="sticky h-screen left-0 top-0">
                <Sidebar />
            </div>
            <div className="flex-1">
                <div className="body w-full h-full flex flex-col items-center">
                    <h1 className="text-black font-serif text-center text-7xl">Face Recognition Setup</h1>
                    <div className="mt-5 flex justify-center items-center ">
                        <div className="overflow-hidden p-3 bg-[#DAC0A3]" style={{ width: "70%", height: "auto" }}>
                            <Webcam ref={webcamRef} mirrored={false} screenshotFormat="image/jpeg" />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center items-center w-full">
                        <div className="w-1/2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-[#DAC0A3] rounded-full" style={{ width: `${verifying ? ((countUp) / 1) * 100 : capturing ? ((countUp) / 12) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                    <div className="mt-5 flex-col justify-center items-center">
                        <button onClick={startCapture} className="bg-[#DAC0A3] text-black py-2 px-4 rounded ${capturing ? 'opacity-50 cursor-not-allowed' : ''}" disabled={capturing}>
                          {capturing ? 'Capturing...' : 'Capture photos'}
                        </button>
                        
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <p>{countUp == 12 ? !capturing ? isSuccess ? 'Successfully added face id' : 'Please try again' : '' : ''}</p>
                    </div>

                    <div className="mt-5 flex-col justify-center items-center">
                        <button onClick={verify} className="bg-[#DAC0A3] text-black py-2 px-4 rounded ${capturing ? 'opacity-50 cursor-not-allowed' : ''}" disabled={verifying}>
                          {verifying ? 'Verifying...' : 'Verify face'}
                        </button>
                        {errorMessage && <p className='text-base pl-1 pb-4 text-red-600 font-sans'>{errorMessage}</p>}
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <p>{countUp == 1 ? !verifying ? waitVerify ? verified ? 'Face matched' : 'Face not match' : '' : '' : ''}</p>
                    </div>

                </div>
            </div>
        </div>
  );
};

export default WebcamCapture;