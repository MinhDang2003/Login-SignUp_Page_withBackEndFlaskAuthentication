import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Sidebar from "../component/Sidebar";
import { axiosPublic } from '../api/axios';
import axios, { AxiosError } from 'axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const frameWidth = 300;
const frameHeight = 400;

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

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = frameWidth;
      canvas.height = frameHeight;

      const offsetX = (image.width - frameWidth) / 2;
      const offsetY = (image.height - frameHeight) / 2;

      ctx?.drawImage(image, offsetX, offsetY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

      const croppedImageSrc = canvas.toDataURL('image/jpeg');
      setImages((prevImages) => [...prevImages, croppedImageSrc]);
    };
  }, []);

  const startCapture = useCallback(() => {
    setCountUp(0);
    setErrorMessage('');
    setImages([]);
    setCapturing(true);
    setIsSuccess(false);

    const intervalId = setInterval(() => {
      captureImage();
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
  }, [captureImage, axiosPrivate]);

  const verify = useCallback(() => {
    setCountUp(0);
    setErrorMessage('');
    setImages([]);
    setVerifying(true);
    setVerified(false);
    setWaitVerify(false);

    const intervalId = setInterval(() => {
      captureImage();
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
  }, [captureImage, axiosPrivate]);

  return (
    <div className="flex h-screen w-screen min-h-screen items-start overflow-y-auto">
      <div className="sticky h-screen left-0 top-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-black font-serif text-center text-7xl">Facial Verification</h1>
        <div className="mt-5 flex justify-center items-center">
          <div className="relative" style={{ width: frameWidth, height: frameHeight }}>
            <Webcam
              ref={webcamRef}
              mirrored={true}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: frameWidth,
                height: frameHeight,
                facingMode: "user"
              }}
              style={{ width: frameWidth, height: frameHeight }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: frameWidth,
                height: frameHeight,
                border: '10px solid #DAC0A3',
                boxSizing: 'border-box'
              }}
            ></div>
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
  );
};

export default WebcamCapture;
