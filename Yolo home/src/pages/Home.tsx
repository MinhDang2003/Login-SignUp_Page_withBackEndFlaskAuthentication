import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useState } from "react";
import "../App.css";
import HCMUTlogo from '../assets/OIP.png';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
);

function Home() {
    
    const navigate = useNavigate();
    
    const logout = useLogout();

<<<<<<< Updated upstream
    const signOut = async () => {
        await logout();
        navigate('/login');
    }
=======
	// const temperature = 30;
	// const humidity = 75;
	// const brightness = 90;
>>>>>>> Stashed changes

    const stateList = ["Temperature", "Moisture", "Light"];
    const modeList = ["Day", "Week", "Month"];

    const temperature = 30;
    const moisture = 75;
    const light = 90;

    const currentDate = new Date();

    const currentHour = currentDate.getHours();
    const currentDayOfWeek = currentDate.getDay();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthLabel = [];
    const weekLabel = [];
    const dayLabel = [];

    for (let i = 1; i <= 24; i++) {
        dayLabel.push((currentHour + i) % 24);
    }
    for (let i = 1; i <= 7; i++) {
        weekLabel.push(weeks[(currentDayOfWeek + i) % 7])
    }
    const daysInEachMonth = [];

    for (let month = 0; month < 12; month++) {
        const days = new Date(currentYear, month + 1, 0).getDate();
        daysInEachMonth.push(days);
    }

<<<<<<< Updated upstream
    for (let date = 0; date <= 30; date += 3) {
        const count = currentDay - 30 + date;
        if (count <= 0) {
            monthLabel.push((daysInEachMonth[(currentMonth - 1 +12) % 12] - count).toString() + " " + months[(currentMonth - 1 + 12) % 12]);
        }
        else {
            monthLabel.push(count.toString() + " " + months[currentMonth]);
        }
    }
=======
	/*
	const temperatureDay = [];
	for (let i = 0; i < 23; i++) {
		const tmp = Math.floor(Math.random() * (40 - 27 + 1)) + 27;
		temperatureDay.push(tmp);
	}
	temperatureDay.push(temperature);
>>>>>>> Stashed changes

    const labelList = [dayLabel, weekLabel, monthLabel];


    const temperatureDay = [];
    for (let i = 0; i < 23; i++) {
        const tmp = Math.floor(Math.random() * (40 - 27 + 1)) + 27;
        temperatureDay.push(tmp);
    }
    temperatureDay.push(temperature);

    const temperatureWeek = [];
    for (let i = 0; i < 6; i++) {
        const tmp = Math.floor(Math.random() * (40 - 27 + 1)) + 27;
        temperatureWeek.push(tmp);
    }
    temperatureWeek.push(temperature);

    const temperatureMonth = [];
    for (let i = 0; i < 29; i++) {
        const tmp = Math.floor(Math.random() * (40 - 27 + 1)) + 27;
        temperatureMonth.push(tmp);
    }
    temperatureMonth.push(temperature);


    const moistureDay = [];
    for (let i = 0; i < 23; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        moistureDay.push(tmp);
    }
    moistureDay.push(moisture);

<<<<<<< Updated upstream
    const moistureWeek = [];
    for (let i = 0; i < 6; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        moistureWeek.push(tmp);
    }
    moistureWeek.push(moisture);
=======
	const brightnessMonth = [];
	for (let i = 0; i < 29; i++) {
		const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
		brightnessMonth.push(tmp);
	}
	brightnessMonth.push(brightness);
	*/

	const temperatureDay = handle_get_temp(0)["value"];
	const humidityDay = handle_get_humid(0)["value"];
	const brightnessDay = handle_get_brightness(0)["value"];

	const temperatureWeek = handle_get_temp(1)["value"];
	const humidityWeek = handle_get_humid(1)["value"];
	const brightnessWeek = handle_get_brightness(1)["value"];

	const temperatureMonth = handle_get_temp(2)["value"];
	const humidityMonth = handle_get_humid(2)["value"];
	const brightnessMonth = handle_get_brightness(2)["value"];

	const temperature = temperatureDay[temperatureDay.length - 1];
	const humidity = humidityDay[humidityDay.length - 1];
	const brightness = brightnessDay[brightnessDay.length - 1];

>>>>>>> Stashed changes

    const moistureMonth = [];
    for (let i = 0; i < 29; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        moistureMonth.push(tmp);
    }
    moistureMonth.push(moisture);


    const lightDay = [];
    for (let i = 0; i < 23; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        lightDay.push(tmp);
    }
    lightDay.push(light);

    const lightWeek = [];
    for (let i = 0; i < 6; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        lightWeek.push(tmp);
    }
    lightWeek.push(light);

    const lightMonth = [];
    for (let i = 0; i < 29; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        lightMonth.push(tmp);
    }
    lightMonth.push(light);

    const dataList = [[temperatureDay, temperatureWeek, temperatureMonth],
                        [moistureDay, moistureWeek, moistureMonth],
                        [lightDay, lightWeek, lightMonth]];

    const [state, setState] = useState(0);
    const [mode, setMode] = useState(0);

    const labels = labelList[mode].map(label => label.toString());

    const options = {
        responsive: true,
    };

    const initData = {
        labels,
        datasets: [
            {
                data: dataList[state][mode],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    const [data, setData] = useState(initData);

    const toggleState = (num: boolean) => {
        setState((prevState) => {
            const newState = (prevState + (num ? 1 : -1) + 3) % 3;
            updateDataAndLabels(newState, mode);
            return newState;
        });
    };

    const toggleMode = (num: boolean) => {
        setMode((prevMode) => {
            const newMode = (prevMode + (num ? 1 : -1) + 3) % 3;
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
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        };
        setData(data);
    };


    return (
        <div className="w-screen h-screen flex items-start">
            <nav className="fixed top-0 left-0 w-1/8 h-full flex flex-col justify-center items-center bg-gray-200">
                <div className="absolute top-[10%] h-1/10 w-full p-4 logo">
                    <img src={HCMUTlogo} className="h-12 mx-auto" />
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="h-2/10 w-full p-4 navItem" style={{ top: '20%' }}>
                        <Link className="py-4" to="/Dashboard">Dashboard</Link>
                    </div>
                </div>
                <div className="absolute bottom-[10%] h-10/10 w-full p-4 navItem" onClick={signOut}>
                    <a href="#">Logout</a>
                </div>
            </nav>
            <div className="body" style={{ marginLeft: '5%', width: '100%' }}>
                <div className="flex flex-row justify-center items-center field1">
                    <div className="flex flex-col justify-center items-center field1Item">
                        <h1 className="mx-auto">Temperature</h1>
                        <div>{temperature}C</div>
                    </div>
                    <div className="flex flex-col justify-center items-center field1Item">
                        <h1 className="mx-auto">Moisture</h1>
                        <div>{moisture}%</div>
                    </div>
                    <div className="flex flex-col justify-center items-center field1Item">
                        <h1 className="mx-auto">Light</h1>
                        <div>{light}%</div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center field2">
                    <button onClick={() => toggleState(false)}>
                        {"<"}
                    </button>
                    <div className="flex flex-col justify-center items-center showGraph">
                        <div style={{ height: 'auto',width: '100%' }}>
                            <h1>{stateList[state]}</h1>
                        </div>
                        <div className="line-graph" style={{ height: '200px', width: '100%' }}>
                            <Line options={options} data={data} />
                        </div>
                        <div className="flex flex-row justify-center items-center mode-buttons" style={{ height: 'auto', width: '100%' }}>
                            <button onClick={() => toggleMode(false)}>
                                {"<<"}
                            </button>
                            <div style={{ height: 'auto', width: '100px' }}>
                                <h2>{modeList[mode]}</h2>
                            </div>
                            <button onClick={() => toggleMode(true)}>
                                {">>"}
                            </button>
                        </div>
                    </div>
                    <button onClick={() => toggleState(true)}>
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;