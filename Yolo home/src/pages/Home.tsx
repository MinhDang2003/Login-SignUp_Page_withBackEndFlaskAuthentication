import { useState } from "react";
import "../App.css";
import Sidebar from "../component/Sidebar";
import tempicon from "../assets/temperature.png";
import humidicon from "../assets/humidity.png";
import brighticon from "../assets/brightness.png";
import { axiosPublic } from "../api/axios";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function Home() {
	const stateList = ["Temperature", "Humidity", "Brightness"];
	const modeList = ["Day", "Week", "Month"];

	const currentDate = new Date();

	const currentHour = currentDate.getHours();
	const currentDayOfWeek = currentDate.getDay();
	const currentDay = currentDate.getDate();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const monthLabel = [];
	const weekLabel = [];
	const dayLabel : string[]=[];

	const fetchTemperature = async (opt: number) => {
		const response = await axiosPublic.post("/api/temperature", {
			option: opt,
		});
		return response.data;
	};
	
	const fetchHumidity = async (opt: number) => {
		const response = await axiosPublic.post("/api/humidity", { option: opt });
		return response.data;
	};

	const fetchBrightness = async (opt: number) => {
		const response = await axiosPublic.post("/api/temperature", {
			option: opt,
		})
		return response;
	};

	var temperatureDay
	fetchTemperature(0).then((data) => {
		temperatureDay=data;
		for (let i=0; i < 24; i++) {
			dayLabel.push(temperatureDay.temp[i].hour);
        }
		console.log(dayLabel);
	});
	
	
	
	const temperatureWeek = fetchTemperature(1);
	const temperatureMonth = fetchTemperature(2);
	const humidityDay = fetchHumidity(0);
	const humidityWeek = fetchHumidity(1);
	const humidityMonth = fetchHumidity(2);
	const brightnessDay = fetchBrightness(0);
	const brightnessWeek = fetchBrightness(1);
	const brightnessMonth = fetchBrightness(2);

	for (let i = 0; i < 7; i++) {
		weekLabel.push(weeks[(currentDayOfWeek + i) % 7]);
	}
	const daysInEachMonth = [];

	for (let month = 0; month < 12; month++) {
		const days = new Date(currentYear, month + 1, 0).getDate();
		daysInEachMonth.push(days);
	}

	for (let date = 0; date <= 30; date += 3) {
		const count = currentDay - 30 + date;
		if (count <= 0) {
			monthLabel.push(
				(daysInEachMonth[(currentMonth - 1 + 12) % 12] - count).toString() +
					" " +
					months[(currentMonth - 1 + 12) % 12]
			);
		} else {
			monthLabel.push(count.toString() + " " + months[currentMonth]);
		}
	}

	const labelList = [dayLabel, weekLabel, monthLabel];

	const temperature = 35;
	const humidity = 35;
	const brightness = 35;
	const dataList = [
		[temperatureDay, temperatureWeek, temperatureMonth],
		[humidityDay, humidityMonth, humidityWeek],
		[brightnessDay, brightnessWeek, brightnessMonth],
	];

	const [state, setState] = useState(0);
	const [mode, setMode] = useState(0);

	const labels = labelList[mode].map((label) => label.toString());

	const options = {
		responsive: true,
	};

	const initData = {
		labels,
		datasets: [
			{
				data: dataList[state][mode],
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};
	const [data, setData] = useState(initData);

	const toggleState = (num: number) => {
		setState(() => {
			const newState = num;
			updateDataAndLabels(newState, mode);
			return newState;
		});
	};

	const toggleMode = (num: number) => {
		setMode(() => {
			const newMode = num;
			updateDataAndLabels(state, newMode);
			return newMode;
		});
	};

	const updateDataAndLabels = (newState: number, newMode: number) => {
		const labels = labelList[newMode].map((label) => label.toString());
		const data = {
			labels,
			datasets: [
				{
					data: dataList[newState][newMode],
					borderColor: "rgb(255, 99, 132)",
					backgroundColor: "rgba(255, 99, 132, 0.5)",
				},
			],
		};
		setData(data);
	};

	return (
		<div className="w-screen h-screen  items-start">
			<div className="h-12">
				<Sidebar />
			</div>
			<div className="body w-screen h-screen ">
				<h1 className="text-black font-serif text-center text-7xl">Home</h1>
				<div className="flex flex-wrap justify-center field1 bg-[#DAC0A3] shadow-xl">
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<img src={tempicon} className="h-32 w-32" />
						<div>{temperature}C</div>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<img src={humidicon} className="h-32 w-32" />
						<div>{humidity}%</div>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<img src={brighticon} className="h-32 w-32" />
						<div>{brightness}%</div>
					</div>
				</div>
				<div className="mt-5  items-center bg-[#DAC0A3] shadow-xl ">
					<div>
						<h1 className=" text-black"> History Log</h1>

						<button className="m-5 w-40" onClick={() => toggleState(0)}>
							{"Temperature"}
						</button>
						<button className="m-5 w-40" onClick={() => toggleState(1)}>
							{"Humidity"}
						</button>
						<button className="m-5 w-40" onClick={() => toggleState(2)}>
							{"Brightness"}
						</button>
					</div>
					<div>
						<button className="m-5 w-40" onClick={() => toggleMode(0)}>
							{"Day"}
						</button>
						<button className="m-5 w-40" onClick={() => toggleMode(1)}>
							{"Weak"}
						</button>
						<button className="m-5 w-40" onClick={() => toggleMode(2)}>
							{"Month"}
						</button>
					</div>
					<div className="flex flex-col justify-center items-center showGraph bg-inherit text-black">
						<div style={{ height: "auto", width: "100%" }}>
							<h1>{stateList[state]}</h1>
						</div>
						<div
							className="line-graph"
							style={{ height: "500px", width: "90%" }}
						>
							<Line options={options} data={data} />
						</div>
						<div
							className="flex flex-row justify-center items-center mode-buttons"
							style={{ height: "auto", width: "100%" }}
						>
							<div style={{ height: "auto", width: "100px" }}>
								<h2>{modeList[mode]}</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
