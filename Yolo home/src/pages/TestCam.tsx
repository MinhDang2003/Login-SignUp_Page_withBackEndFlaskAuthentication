import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Cropper from 'react-easy-crop';
import Sidebar from "../component/Sidebar";
import { axiosPublic } from '../api/axios';
import axios, { AxiosError } from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const WebcamCapture = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const webcamRef = useRef<Webcam>(null);
  const [countUp, setCountUp] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [waitVerify, setWaitVerify] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const startCapture = useCallback(() => {
    setCountUp(0);
    setErrorMessage('');
    setImages([]);
    setCapturing(true);
    setIsSuccess(false);

    const intervalId = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImages(prevImages => [...prevImages, imageSrc]);
      }
      setCountUp(prevCount => prevCount + 1);
    }, 100); 

    const sendRequest = async (attempt = 0) => {
      try {
        const response = await axiosPrivate.post('/api/getTrainImgs', { img_arr: imagesRef.current });
        setErrorMessage("");
        return response;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 400) setErrorMessage(axiosError.response?.data?.msg);
          if (attempt < 1) return sendRequest(attempt + 1);
          throw error;
        }
      }
    };

    setTimeout(async () => {
      clearInterval(intervalId);
      setCapturing(false);
      setUploading(true);
      try {
        await sendRequest();
        setIsSuccess(true);
      } catch (error) {
        setIsSuccess(false);
      }
      setUploading(false);
    }, 1200);
  }, [webcamRef, axiosPrivate, images]);

  const verify = useCallback(() => {
    setCountUp(0);
    setErrorMessage('');
    setImages([]);
    setVerifying(true);
    setVerified(false);
    setWaitVerify(false);

    const intervalId = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImages([imageSrc]);
      }
      setCountUp(prevCount => prevCount + 1);
    }, 1000);

    const sendRequest = async (attempt = 0) => {
      try {
        const response = await axiosPrivate.post('/api/verification', { input_img: imagesRef.current });
        setErrorMessage("");
        return response;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 400) setErrorMessage(axiosError.response?.data?.msg);
          if (attempt < 1) return sendRequest(attempt + 1);
          throw error;
        }
      }
    };

    setTimeout(async () => {
      clearInterval(intervalId);
      setVerifying(false);
      setWaitVerify(true);
      try {
        const res = await sendRequest();
        setVerified(res?.data?.verified);
      } catch (error) {
        setVerified(false);
      }
      setWaitVerify(false);
    }, 1100);
  }, [webcamRef, axiosPrivate, images]);

  return (
    <div className="flex h-screen w-screen min-h-screen items-start overflow-y-auto">
      <div className="sticky h-screen left-0 top-0">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="body w-full h-full flex flex-col items-center">
          <h1 className="text-black font-serif text-center text-7xl">Facial Verification</h1>
          <div className="mt-5 flex justify-center items-center">
            <div className="overflow-hidden p-3 bg-[#DAC0A3]" style={{ width: "70%", height: "auto" }}>
              <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                <Webcam
                  ref={webcamRef}
                  mirrored={true}
                  screenshotFormat="image/jpeg"
                  style={{ position: 'absolute', width: '100%', height: '100%' }}
                />
                <Cropper
                  image={webcamRef.current?.getScreenshot()}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{
                    containerStyle: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center items-center w-full">
            <div className="w-1/2 bg-gray-200 rounded-full">
              <div className="h-2 bg-[#DAC0A3] rounded-full" style={{ width: `${verifying ? (countUp / 1) * 100 : capturing ? (countUp / 12) * 100 : 0}%` }}></div>
            </div>
          </div>
          <div className="mt-5 flex-col justify-center items-center">
            <button onClick={startCapture} className="bg-[#DAC0A3] text-black py-2 px-4 rounded" disabled={capturing || uploading}>
              {capturing ? 'Capturing...' : uploading ? 'Uploading...' : 'Capture face images'}
            </button>
          </div>
          <div className="mt-5 flex justify-center items-center">
            <p>{countUp == 12 && !capturing ? (isSuccess ? 'Successfully added face id' : uploading ? '' : 'Please try again') : ''}</p>
          </div>
          <div className="mt-5 flex-col justify-center items-center">
            <button onClick={verify} className="bg-[#DAC0A3] text-black py-2 px-4 rounded" disabled={verifying || waitVerify}>
              {verifying ? 'Uploading face images...' : waitVerify ? 'Verifying' : 'Verify face'}
            </button>
          </div>
          <div className="mt-5 flex justify-center items-center">
            <p>{countUp == 1 && !verifying ? (verified ? 'Face match' : waitVerify ? 'Verifying' : 'Face not match') : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;
