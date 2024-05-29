import React, { useRef, useState } from "react";
import "../App.css";
import Sidebar from "../component/Sidebar";
import Webcam from "react-webcam";

function FaceRegFront() {
	const instruction = [
		"Move your head slowly to the right",
		"Move your head slowly to the left",
		"Move your head slowly up",
		"Move your head slowly down",
		"Move your head slowly back to normal",
		"Success",
	];
	const webcamRef = useRef(null);
	const [progress, setProgress] = useState(0);

	const handleButtonClick = () => {
		if (progress < 5) {
			setProgress((prevProgress) => prevProgress + 1);
		}
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
						<div className="  overflow-hidden p-3 bg-[#DAC0A3]" style={{ width: "70%", height: "auto" }}>
							<Webcam ref={webcamRef} mirrored={true} />
						</div>
					</div>
					<div className="mt-5 flex justify-center items-center w-full">
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
			</div>
		</div>
	);
}

export default FaceRegFront;
