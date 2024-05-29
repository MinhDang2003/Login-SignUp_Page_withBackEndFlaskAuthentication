import React, { useEffect, useRef, useState } from 'react';
import "../App.css";
import Sidebar from "../component/Sidebar";
import Webcam from "react-webcam";

function FaceRegFront() {
	const instruction = ["Move your head slowly to the right", "Move your head slowly to the left", "Move your head slowly up", "Move your head slowlyy down", "Move your head slowly back to normal", "Success"];
	const webcamRef = useRef(null);
	const [frameList, setFrameList] = useState([]);
	const [progress, setProgress] = useState(0);

	const handleButtonClick = () => {
		if (progress < 5) {
			setProgress(prevProgress => prevProgress + 1);
		}
	};

	useEffect(() => {
		const captureFrame = () => {
			const imageSrc = webcamRef.current.getScreenshot();
			setFrameList(prevFrames => [...prevFrames, imageSrc]);
		};

		const interval = setInterval(captureFrame, 1000); // Capture frame every second

		return () => clearInterval(interval); // Cleanup the interval on unmount
	}, []);

	return (
		<div className="w-screen h-screen  items-start">
			<div className="h-12">
				<Sidebar />
			</div>
			<div className="body w-screen h-screen ">
				<h1>Real-time Face Recognition</h1>
				<div className="mt-5 flex justify-center items-center">
					<div className="rounded-full overflow-hidden" style={{ width: '30%', height: 'auto' }}>
						<Webcam ref={webcamRef} mirrored={true} />
					</div>
				</div>
				<div className="mt-5 flex justify-center items-center">
					<div className="w-1/2 bg-gray-200 rounded-full">
						<div className="h-2 bg-blue-500 rounded-full" style={{ width: `${(progress / 5) * 100}%` }}></div>
					</div>
				</div>
				<div className="mt-5 flex justify-center items-center">
					<button onClick={handleButtonClick} className="bg-blue-500 text-white py-2 px-4 rounded">
						Increment Progress
					</button>
				</div>
				{progress < 6 && (
					<div className="mt-5 flex justify-center items-center">
						<p>{instruction[progress]}</p>
					</div>
				)}
			</div>
			{/* Display the frame list */}
			{frameList.map((frame, index) => (
				<img key={index} src={frame} alt={`Frame ${index}`} />
			))}
		</div>
	);
}

export default FaceRegFront;