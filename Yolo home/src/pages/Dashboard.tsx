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
import mic_icon from '../assets/dashboard/microphone.png'
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
<<<<<<< Updated upstream
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
=======
    const commands = [
        {
          command: "add device * in *",
          callback: (deviceInfo, roomID) => {
            const [deviceType, deviceID] = deviceInfo.split(" ");
            setInputs({ roomID, deviceID, deviceType });
            handleSubmit({ target: { name: "addDevice" }, preventDefault: () => {} });
          },
        },
        {
          command: "remove device * in *",
          callback: (deviceInfo, roomID) => {
            const [deviceType, deviceID] = deviceInfo.split(" ");
            setInputs({ roomID, deviceID, deviceType });
            handleSubmit({ target: { name: "removeDevice" }, preventDefault: () => {} });
          },
        },
        {
          command: "add room *",
          callback: (roomID) => {
            setInputs({ ...inputs, roomID });
            handleSubmit({ target: { name: "addRoom" }, preventDefault: () => {} });
          },
        },
        {
          command: "remove room *",
          callback: (roomID) => {
            setInputs({ ...inputs, roomID });
            handleSubmit({ target: { name: "removeRoom" }, preventDefault: () => {} });
          },
        },
        {
          command: "toggle device * in *",
          callback: (deviceInfo, roomID) => {
            const [deviceType, deviceID] = deviceInfo.split(" ");
            toggleFunction([roomID, deviceID, 0, deviceType]);
          },
        },
      ];
    
      const { transcript, resetTranscript } = useSpeechRecognition({ commands });
    
      if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <div>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</div>;
      }
	const [inputs, setInputs] = useState({});

	const handleChange = (event) => {
	  const name = event.target.name;
	  const value = event.target.value;
	  setInputs(values => ({...values, [name]: value}))
	}
    const [isListening, setIsListening] = useState(false);

	const [triggerRender, setTriggerRender] = useState(false);
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, close: () => void) =>{
	  event.preventDefault();

	  if (event.target.name == "addRoom"){
		try {
			const res = await RoomsApi.addRoom(inputs.roomID);

			setTriggerRender(!triggerRender);
			close();
		} catch (error) {
			console.error('Error adding room:', error);
            setError((error as Error).response.data.msg || 'An error occurred');
            close();
		}
	  }
	  else if (event.target.name == "removeRoom"){
		try {
			await RoomsApi.removeRoom(inputs.roomID);
			setTriggerRender(!triggerRender);
			close();
		} catch (error) {
            setError((error as Error).response.data.msg || 'An error occurred');
            close();
		}
	  }
	  else if (event.target.name == "addDevice"){
		try {
			await DeviceApi.addDevice(inputs.roomID,inputs.deviceID,inputs.deviceType,inputs.feedID);
			setTriggerRender(!triggerRender);
			close();
		} catch (error) {
            setError((error as Error).response.data.msg || 'An error occurred');
            close();
		}
	  }
	  else if (event.target.name == "removeDevice"){
		try {
			const res =  await DeviceApi.removeDevice(inputs.roomID,inputs.deviceID);
			setTriggerRender(!triggerRender);
			close();
		} catch (error) {
            setError((error as Error).response.data.msg || 'An error occurred');
            close();
            
		}
	  }
	}
    const closeErrorPopup = () => {
        setError(null);
    };
    const [error, setError] = useState<string | null>(null);
	const [count, setCount] = useState(0)
    const [data, setData] = useState([])
    const [selectedRoom, setSelectedRoom] = useState("{:::}")
    const [toggleData,setToggleData] = useState(null)
    const [devicesData, setDevicesData] = useState({signal:[],devices:[]})
    useEffect(()=>{
      const getData = async () => {
        const res = await getAllRoomsData()
        setData(res)
        if (selectedRoom=="{:::}" || !res.some((item) => item.room_id === selectedRoom)){
        setSelectedRoom(res[0].room_id)
        }
      }
      getData()
    }, [triggerRender]
    )
    useEffect(()=> {
      const getData = async () => {
        const res = await getDevicesOfRoom(selectedRoom)
        if (selectedRoom != "0") setDevicesData(res);
      }
      getData()
    },[selectedRoom,count])
    const handleMicClick = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
            resetTranscript();
        } else {
            SpeechRecognition.startListening();
        }
        setIsListening(!isListening);
    };
    useEffect(() => {
      const toggle = async ()=>{
        const res = await toggleDevice(toggleData[0],toggleData[1],toggleData[2],toggleData[3])
        if (res) {
            setTimeout(()=>{
              setCount((count+1)%2)
            },1000)    
        }
      }
      if (toggleData) {
          toggle()
      }
    },[toggleData])
    useEffect(() => {
        setTimeout(()=>{
            setCount((count+1)%2)
          },1000)  
        // Any logic that needs to run after state change
    }, [triggerRender]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
	return (
		<div className=" flex h-screen w-screen min-h-screen items-start overflow-y-auto">
			<div className="sticky h-screen left-0 top-0" >
				<Sidebarr />
			</div>
			<div className=" grow body w-screen h-screen ">
				<h1 className="text-black font-serif text-center text-7xl">Dashboard</h1>
                <button onClick={handleMicClick} style={{ width: '180px', height: '100px',background:'brown'}} >
                    <span >
                        Voice Assistance
                        <img src={mic_icon} alt="Mic" style={{ width: '50px', height: '50px',margin:'auto' }} />
                    </span>
                </button>
        
				<div className="flex flex-wrap justify-center field1 bg-[#DAC0A3] shadow-xl">
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Add Room</h1>
						<Popup trigger=
                {<button> <span>&#43;</span> </button>} 
                modal nested>
            {close => (
                <div className='modal' style={styles.modal}>
				<button onClick={close} style={styles.closeButton}>
					&times;
				</button>
				<form name="addRoom" onSubmit={(event) => handleSubmit(event, close)} style={styles.form}>
					<label style={styles.label}>
						Enter room ID to add:
					</label>
					<input 
						style={styles.input}
						type="text" 
						name="roomID" 
						value={inputs.roomID || ""} 
						onChange={handleChange}
					/>
					<input 
						type="submit" 
						style={styles.submitButton} 
					/>
				</form>
			</div>
            )}
            </Popup>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Add Device</h1>
						<Popup 
                trigger={<button><span>&#43;</span> </button>} 
                modal 
                nested
            >
                {close => (
                    <div className='modal' style={styles.modal}>
                        <button onClick={close} style={styles.closeButton}>
                            &times;
                        </button>
                        <form name="addDevice" onSubmit={(event) => handleSubmit(event, close)} style={styles.form}>
                            <label style={styles.label}>
                                Enter room ID to add device:
                                <input 
                                    style={styles.input}
                                    type="text" 
                                    name="roomID" 
                                    value={inputs.roomID || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <label style={styles.label}>
                                Enter device ID to add:
                                <input 
                                    style={styles.input}
                                    type="text" 
                                    name="deviceID" 
                                    value={inputs.deviceID || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <label style={styles.label}>
                                Enter the device type:
                                <input 
                                    style={styles.input}
                                    type="text" 
                                    name="deviceType" 
                                    value={inputs.deviceType || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <label style={styles.label}>
                                Enter the feed ID:
                                <input 
                                    style={styles.input}
                                    type="text" 
                                    name="feedID" 
                                    value={inputs.feedID || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <input 
                                type="submit" 
                                style={styles.submitButton} 
                            />
                        </form>
                    </div>
                )}
            </Popup>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Remove Room</h1>
						<Popup trigger=
                {<button> <span>&#8722;</span> </button>} 
                modal nested>
            {close => (
                <div className='modal' style={styles.modal}>
				<button onClick={close} style={styles.closeButton}>
					&times;
				</button>
				<form name="removeRoom" onSubmit={(event) => handleSubmit(event, close)}  style={styles.form}>
					<label style={styles.label}>
						Enter room ID to remove:
					</label>
					<input 
						style={styles.input}
						type="text" 
						name="roomID" 
						value={inputs.roomID || ""} 
						onChange={handleChange}
					/>
					<input 
						type="submit" 
						style={styles.submitButton} 
					/>
				</form>
			</div>
            )}
            </Popup>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Remove Device</h1>
						<Popup 
                trigger={<button><span>&#8722;</span></button>} 
                modal 
                nested
            >
                {close => (
                    <div className='modal' style={styles.modal}>
                        <button onClick={close} style={styles.closeButton}>
                            &times;
                        </button>
                        <form name="removeDevice" onSubmit={(event) => handleSubmit(event, close)}  style={styles.form}>
                            <label style={styles.label}>
                                Enter room ID to remove device:
                                <input 
                                    style={styles.input}
                                    type="text" 
                                    name="roomID" 
                                    value={inputs.roomID || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <label style={styles.label}>
                                Enter device ID to remove:
                                <input 
                                    style={styles.input}
                                    type="text" 
                                    name="deviceID" 
                                    value={inputs.deviceID || ""} 
                                    onChange={handleChange}
                                />
                            </label>
                            <input 
                                type="submit" 
                                style={styles.submitButton} 
                            />
                        </form>
                    </div>
                )}
            </Popup>
            {error && (
                <Popup open={true} onClose={closeErrorPopup} modal>
                    <div className='modal' style={styles.modal}>
                        <button onClick={closeErrorPopup} style={styles.closeButton}>
                            &times;
                        </button>
                        <div style={styles.errorMessage}>{error}</div>
                    </div>
                </Popup>
            )}
					</div>
				</div>
				<div className="mt-5  items-center bg-[#DAC0A3] shadow-xl ">
					<div>
						<h1 className=" text-black">Rooms</h1>
						<RoomBar data={[data,selectedRoom,setSelectedRoom]}></RoomBar>
          
					</div>
				</div>

				<div className="mt-5  items-center bg-[#DAC0A3] shadow-xl ">
					<div>
						<h1 className=" text-black">Devices</h1>
						<DevicesBar data={[devicesData.devices,setToggleData]}></DevicesBar>
						
					</div>
>>>>>>> Stashed changes
				</div>
			</div>
		</div>
	);
	
}

export default Dashboard;
