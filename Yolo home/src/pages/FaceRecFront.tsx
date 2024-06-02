import React, { useRef, useState, useEffect } from "react";
import "../App.css";
import Sidebar from "../component/Sidebar";
import Webcam from "react-webcam";
import {axiosPublic} from '../api/axios';
import axios from "axios";

function FaceRecFront() {
    const instruction = [
        "Move your head slowly to the right",
        "Move your head slowly to the left",
        "Move your head slowly up",
        "Move your head slowly down",
        "Move your head slowly back to normal",
        "Success",
    ];
    const webcamRef = useRef(null);
    const [countdown, setCountdown] = useState(15);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [name, setName] = useState("");
    useEffect(() => {
        let intervalId;
        if (isCapturing && countdown > 0) {
            intervalId = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
                captureImage();
            }, 100); // Capture 10 images every second
        } else if (countdown === 0) {
            clearInterval(intervalId);
            setIsCapturing(false);
            sendImagesToBackend();
        }
        return () => clearInterval(intervalId);
    }, [isCapturing, countdown]);

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImages((prevImages) => [...prevImages, imageSrc]);
    };

    const handleButtonClick = () => {
        if (!isCapturing) {
            setIsCapturing(true);
            setCapturedImages([]);
            setCountdown(15);
        }
    };

    const sendImagesToBackend = async () => {
        const response = await axiosPublic.post("/users/profile");
        setName(response.data.name);
        axiosPublic.post("/api/getTrainImgs", {  name: name,img_arr: capturedImages })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="flex h-screen w-screen min-h-screen items-start overflow-y-auto">
            <div className="sticky h-screen left-0 top-0">
                <Sidebar />
            </div>
            <div className="flex-1">
                <div className="body w-full h-full flex flex-col items-center">
                    <h1 className="text-black font-serif text-center text-7xl">Face Recognition Setup</h1>
                    <div className="mt-5 flex justify-center items-center ">
                        <div className="overflow-hidden p-3 bg-[#DAC0A3]" style={{ width: "70%", height: "auto" }}>
                            <Webcam ref={webcamRef} mirrored={true} screenshotFormat="image/jpeg" />
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center items-center w-full">
                        <div className="w-1/2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-[#DAC0A3] rounded-full" style={{ width: `${((15-countdown) / 15) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <button onClick={handleButtonClick} className="bg-[#DAC0A3] text-black py-2 px-4 rounded">
                            Start set up
                        </button>
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                        <p>{countdown > 0 ? instruction[Math.floor((15 - countdown) / 3)] : instruction[5]}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FaceRecFront;
