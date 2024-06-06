import {Link } from "react-router-dom";
import Users from "../component/Users";
import 'regenerator-runtime/runtime';
import SpeechRecognition, {
    useSpeechRecognition,
  } from "react-speech-recognition";
import { useTheme } from "@mui/material";
import { useEffect, useState } from 'react'
import Sidebarr from "../component/Sidebar";
import {getAllRoomsData,getDevicesOfRoom,toggleDevice} from '../business/HomePageData'
import RoomBar from '../component/bars/rooms/RoomsBar'
import DevicesBar from '../component/bars/devices/DevicesBar'
import { tokens } from "../theme.tsx";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import RoomsApi from '../api_copy/RoomsApi'
import DeviceApi from '../api_copy/DeviceApi'
const styles = {
    modal: {
        position: 'relative' as 'relative',
        padding: '20px',
        border: '2px solid black',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        marginTop: '30px', // Added margin to push form down below close button
    },
    label: {
        color: 'black',
        backgroundColor: 'beige',
        padding: '10px',
        borderRadius: '5px',
        fontWeight: 'bold' as 'bold',
        marginBottom: '10px',
        width: '100%',
        textAlign: 'left' as 'left',
    },
    input: {
        backgroundColor: 'white',
        color: 'black',
        border: '2px solid black',
        borderRadius: '5px',
        padding: '10px',
        width: '100%',
        boxSizing: 'border-box' as 'border-box',
        marginBottom: '15px',
    },
    submitButton: {
        backgroundColor: 'beige',
        color: 'black',
        border: '2px solid black',
        borderRadius: '5px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: 'bold' as 'bold',
    },
    closeButton: {
        position: 'absolute' as 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        borderRadius: '0%', // Make the button square
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 'bold' as 'bold',
        fontSize: '20px',
        lineHeight: '20px',
    },
    errorMessage: {
        color: 'red',
        fontWeight: 'bold' as 'bold',
        textAlign: 'center' as 'center',
    },
};

function Dashboard() {
	return (
		<div className="w-screen h-screen  items-start">
			<aside className="w-screen">
				<Sidebar />
			</aside>
			<section className="flex-grow p-6">
				<h1>Dashboard</h1>
				<br />
				<Users />
				<br />
				<div className="flex">
					<Link to="/">Home</Link>
				</div>
			</div>
		</div>
	);
	
}

export default Dashboard;
