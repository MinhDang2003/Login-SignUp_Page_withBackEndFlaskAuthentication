import { useState } from "react";
import "../App.css";
import Sidebar from "../component/Sidebar";
import tempicon from "../assets/temperature.png";
import humidicon from "../assets/humidity.png";
import brighticon from "../assets/brightness.png";
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
    const stateList = ["Temperature", "Humidity", "Brightness"];
    const modeList = ["Day", "Week", "Month"];

    const temperature = 30;
    const humidity= 75;
    const brightness = 90;

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

    for (let date = 0; date <= 30; date += 3) {
        const count = currentDay - 30 + date;
        if (count <= 0) {
            monthLabel.push((daysInEachMonth[(currentMonth - 1 +12) % 12] - count).toString() + " " + months[(currentMonth - 1 + 12) % 12]);
        }
        else {
            monthLabel.push(count.toString() + " " + months[currentMonth]);
        }
    }

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


    const humidityDay = [];
    for (let i = 0; i < 23; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        humidityDay.push(tmp);
    }
    humidityDay.push(humidity);

    const humidityWeek = [];
    for (let i = 0; i < 6; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        humidityWeek.push(tmp);
    }
    humidityWeek.push(humidity);

    const humidityMonth = [];
    for (let i = 0; i < 29; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        humidityMonth.push(tmp);
    }
    humidityMonth.push(humidity);


    const brightnessDay = [];
    for (let i = 0; i < 23; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        brightnessDay.push(tmp);
    }
    brightnessDay.push(brightness);

    const brightnessWeek = [];
    for (let i = 0; i < 6; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        brightnessWeek.push(tmp);
    }
    brightnessWeek.push(brightness);

    const brightnessMonth = [];
    for (let i = 0; i < 29; i++) {
        const tmp = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
        brightnessMonth.push(tmp);
    }
    brightnessMonth.push(brightness);

    const dataList = [[temperatureDay, temperatureWeek, temperatureMonth],
                        [humidityDay, humidityMonth, humidityWeek],
                        [brightnessDay, brightnessWeek, brightnessMonth]];

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
            <aside className="top-0 left-0 w-1/5">
                <Sidebar />
            </aside>
            <div className="body w-screen h-screen">
                <h1 className="text-black font-serif text-center text-7xl">Home</h1>
                <div className="flex flex-wrap justify-center field1 bg-[#DAC0A3]">
                    <div className="flex flex-col p-0 mx-10 justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
                        <img src={tempicon} className="h-32 w-32" />
                        <div>{temperature}C</div>
                    </div>
                    <div className="flex flex-col p-0 mx-10 justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
                        <img src={humidicon} className="h-32 w-32" />
                        <div>{humidity}%</div>
                    </div>
                    <div className="flex flex-col p-0 mx-10 justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
                        <img src={brighticon} className="h-32 w-32" />
                        <div>{brightness}%</div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center field2">
                    <button onClick={() => toggleState(false)}>
                        {"<"}
                    </button>
                    <div className="flex flex-col justify-center items-center showGraph">
                        <div style={{ height: 'auto', width: '100%' }}>
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