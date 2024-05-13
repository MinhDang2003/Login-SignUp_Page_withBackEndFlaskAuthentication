import { useState } from "react";
import "../App.css";
import Sidebar from "../component/Sidebar";
import tempicon from "../assets/temperature.png";
import humidicon from "../assets/humidity.png";
import brighticon from "../assets/brightness.png";
import { axiosPublic } from "../api/axios";
import { useEffect } from "react";
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
	
	const [currentTemperature, setCurrentTemperature]= useState(0);
	const [currentHumidity, setCurrentHumidity]= useState(0);
	const [currentBrightness, setCurrentBrightness]= useState(0);

	const [temperatureDay, setTemperatureDay] = useState<number[]>([]);
	const [humidityDay, setHumidityDay] = useState<number[]>([]);
	const [brightnessDay, setBrightnessDay] = useState<number[]>([]);

	const [temperatureWeek, setTemperatureWeek] = useState<number[]>([]);
	const [humidityWeek, setHumidityWeek] = useState<number[]>([]);
	const [brightnessWeek, setBrightnessWeek] = useState<number[]>([]);

	const [temperatureMonth, setTemperatureMonth] = useState<number[]>([]);
	const [humidityMonth, setHumidityMonth] = useState<number[]>([]);
	const [brightnessMonth, setBrightnessMonth] = useState<number[]>([]);

	const [monthLabel, setMonthLabel] = useState<string[]>([]);
	const [weekLabel, setWeekLabel] = useState<string[]>([]);
	const [dayLabel, setDayLabel] = useState<string[]>([]);


	const getCurrentStat = async ()=> {
		try {
            const responseTemp = await axiosPublic.post("/api/current_temperature");
            const dataTemp = responseTemp.data;
            setCurrentTemperature(dataTemp);
            const responseHumid = await axiosPublic.post("/api/current_humidity",{});
            const dataHumid = responseHumid.data;
            setCurrentHumidity(dataHumid);
            const responseBrightness = await axiosPublic.post("/api/current_brightness",{});
            const dataBrightness = responseBrightness.data;
			setCurrentBrightness(dataBrightness);
	}catch (error) {
		console.log(error);
	}
	};
	

	useEffect(() => {
		getCurrentStat();
		fetchData(0); // Fetch initial data for day mode
		fetchData(1);
		fetchData(2);
	}, []);

	const fetchData = async (option: number) => {
		try {
			const responseTemp = await axiosPublic.post("/api/temperature", { option });
			const dataTemp = responseTemp.data;
			
			const responseHumid = await axiosPublic.post("/api/humidity", { option });
			const dataHumid = responseHumid.data;

			const responseBrightness = await axiosPublic.post("/api/brightness", { option });
			const dataBrightness = responseBrightness.data;

			if (option === 0) {
				const tempArray: number[] = [];
				for (let i = 0; i < dataTemp.temperature.length; i++) {
					tempArray.push(dataTemp.temperature[i]['value']);
				}
				setTemperatureDay(tempArray);

				const humidArray: number[] = [];
				for (let i = 0; i < dataHumid.humidity.length; i++) {
					humidArray.push(dataHumid.humidity[i]['value']);
				}
				setHumidityDay(humidArray);

				const brightArray: number[] = [];
				for (let i = 0; i < dataBrightness.brightness.length; i++) {
					brightArray.push(dataBrightness.brightness[i]['value']);
				}
				setBrightnessDay(brightArray);

				const extractedArray: string[] = [];
				for (let i = 0; i < dataBrightness.brightness.length; i++) {
				extractedArray.push(dataBrightness.brightness[i]['hour']);
				}
				setDayLabel(extractedArray);
			} else if (option === 1) {
				const tempArray: number[] = [];
				for (let i = 0; i < dataTemp.temperature.length; i++) {
					tempArray.push(dataTemp.temperature[i]['value']);
				}
				setTemperatureWeek(tempArray);

				const humidArray: number[] = [];
				for (let i = 0; i < dataHumid.humidity.length; i++) {
					humidArray.push(dataHumid.humidity[i]['value']);
				}
				setHumidityWeek(humidArray);

				const brightArray: number[] = [];
				for (let i = 0; i < dataBrightness.brightness.length; i++) {
					brightArray.push(dataBrightness.brightness[i]['value']);
				}
				setBrightnessWeek(brightArray);

				const extractedArray: string[] = [];
				for (let i = 0; i < dataBrightness.brightness.length; i++) {
				extractedArray.push(dataBrightness.brightness[i]['date']);
				}
				setWeekLabel(extractedArray);
			} else if (option === 2) {
				const tempArray: number[] = [];
				for (let i = 0; i < dataTemp.temperature.length; i++) {
					tempArray.push(dataTemp.temperature[i]['value']);
				}
				setTemperatureMonth(tempArray);

				const humidArray: number[] = [];
				for (let i = 0; i < dataHumid.humidity.length; i++) {
					humidArray.push(dataHumid.humidity[i]['value']);
				}
				setHumidityMonth(humidArray);

				const brightArray: number[] = [];
				for (let i = 0; i < dataBrightness.brightness.length; i++) {
					brightArray.push(dataBrightness.brightness[i]['value']);
				}
				setBrightnessMonth(brightArray);

				const extractedArray: string[] = [];
				for (let i = 0; i < dataBrightness.brightness.length; i++) {
				extractedArray.push(dataBrightness.brightness[i]['date']);
				}
				setMonthLabel(extractedArray);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// for (let i = 0; i < 24; i++) {
	// 	dayLabel.push(dataBrightness.brightness[i]['hour']);
	// }
	// for (let i = 0; i < dataBrightness.brightness.length; i++) {
	// 	weekLabel.push(dataBrightness.brightness[i]['date']);
	// }
	// for (let i = 0; i<dataBrightness.brightness.length; i++) {
	// 	monthLabel.push(dataBrightness.brightness[i]['date']);
	// }
	const labelList = [dayLabel, weekLabel, monthLabel];
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
						<div>{currentTemperature}C</div>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<img src={humidicon} className="h-32 w-32" />
						<div>{currentHumidity}%</div>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<img src={brighticon} className="h-32 w-32" />
						<div>{currentBrightness}%</div>
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
							{"Week"}
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
