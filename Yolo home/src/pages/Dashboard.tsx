import { useEffect, useState } from 'react';
import { useTheme } from "@mui/material";
import Sidebarr from "../component/Sidebar";
import RoomBar from '../component/bars/rooms/RoomsBar';
import DevicesBar from '../component/bars/devices/DevicesBar';
import { getAllRoomsData, getDevicesOfRoom, toggleDevice } from '../business/HomePageData';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import RoomsApi from '../api_copy/RoomsApi';
import DeviceApi from '../api_copy/DeviceApi';
import { tokens } from "../theme.tsx";

const styles = {
    modal: {
        position: 'relative',
        padding: '20px',
        border: '2px solid black',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '30px',
    },
    label: {
        color: 'black',
        backgroundColor: 'beige',
        padding: '10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        marginBottom: '10px',
        width: '100%',
        textAlign: 'left',
    },
    input: {
        backgroundColor: 'white',
        color: 'black',
        border: '2px solid black',
        borderRadius: '5px',
        padding: '10px',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '15px',
    },
    submitButton: {
        backgroundColor: 'beige',
        color: 'black',
        border: '2px solid black',
        borderRadius: '5px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'black',
        color: 'white',
        border: 'none',
        borderRadius: '0%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '20px',
        lineHeight: '20px',
    },
    errorMessage: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
    },
};

function Dashboard() {
    const [inputs, setInputs] = useState({});
    const [triggerRender, setTriggerRender] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [data, setData] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("{:::}");
    const [toggleData, setToggleData] = useState(null);
    const [devicesData, setDevicesData] = useState({ signal: [], devices: [] });
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event, close) => {
        event.preventDefault();
        try {
            switch (event.target.name) {
                case "addRoom":
                    await RoomsApi.addRoom(inputs.roomID);
                    break;
                case "removeRoom":
                    await RoomsApi.removeRoom(inputs.roomID);
                    break;
                case "addDevice":
                    await DeviceApi.addDevice(selectedRoom, inputs.deviceID, inputs.deviceType);
                    break;
                case "removeDevice":
                    await DeviceApi.removeDevice(selectedRoom, inputs.deviceID);
                    break;
                default:
                    throw new Error("Unknown action");
            }
            setTriggerRender(!triggerRender);
            close();
        } catch (error) {
            setError(error.response.data.msg || 'An error occurred');
            close();
        }
    };

    const closeErrorPopup = () => setError(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllRoomsData();
            setData(res);
            if (!res.some(item => item.room_id === selectedRoom)) {
                setSelectedRoom(res[0].room_id);
            }
        };
        fetchData();
    }, [triggerRender]);

    useEffect(() => {
        const fetchDevices = async () => {
            const res = await getDevicesOfRoom(selectedRoom);
            if (selectedRoom !== "0") setDevicesData(res);
        };
        fetchDevices();
    }, [selectedRoom, count]);

    useEffect(() => {
        if (toggleData) {
            const toggle = async () => {
                const res = await toggleDevice(toggleData[0], toggleData[1], toggleData[2], toggleData[3]);
                if (res) {
                    setTimeout(() => setCount((count + 1) % 2), 1000);
                }
            };
            toggle();
        }
    }, [toggleData]);

    useEffect(() => {
        setTimeout(() => setCount((count + 1) % 2), 1000);
    }, [triggerRender]);

    return (
        <div className="flex h-screen w-screen min-h-screen overflow-y-auto">
            <div className="sticky h-screen left-0 top-0">
                <Sidebarr />
            </div>
            <div className="flex-grow w-full h-screen p-4">
                <h1 className="text-black font-serif text-center text-7xl mb-6">Dashboard</h1>
                <div className="mt-6 bg-[#DAC0A3] p-6 shadow-xl rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-black text-2xl">Rooms</h1>
                        <div className="flex space-x-2">
                            <Popup trigger={<button className="bg-beige p-2 rounded text-sm">Add Room</button>} modal nested>
                                {close => (
                                    <div className="modal" style={styles.modal}>
                                        <button onClick={close} style={styles.closeButton}>&times;</button>
                                        <form name="addRoom" onSubmit={(event) => handleSubmit(event, close)} style={styles.form}>
                                            <label style={styles.label}>
                                                Enter room ID:
                                                <input type="text" name="roomID" value={inputs.roomID || ""} onChange={handleChange} style={styles.input} />
                                            </label>
                                            <input type="submit" value="Submit" style={styles.submitButton} />
                                        </form>
                                    </div>
                                )}
                            </Popup>
                            <Popup trigger={<button className="bg-beige p-2 rounded text-sm">Remove Room</button>} modal nested>
                                {close => (
                                    <div className="modal" style={styles.modal}>
                                        <button onClick={close} style={styles.closeButton}>&times;</button>
                                        <form name="removeRoom" onSubmit={(event) => handleSubmit(event, close)} style={styles.form}>
                                            <label style={styles.label}>
                                                Enter room ID:
                                                <input type="text" name="roomID" value={inputs.roomID || ""} onChange={handleChange} style={styles.input} />
                                            </label>
                                            <input type="submit" value="Submit" style={styles.submitButton} />
                                        </form>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>
                    <RoomBar data={[data, selectedRoom, setSelectedRoom]} />
                </div>
                <div className="mt-6 bg-[#DAC0A3] p-6 shadow-xl rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-black text-2xl">Devices</h1>
                        <div className="flex space-x-2">
                            <Popup trigger={<button className="bg-beige p-2 rounded text-sm">Add Device</button>} modal nested>
                                {close => (
                                    <div className="modal" style={styles.modal}>
                                        <button onClick={close} style={styles.closeButton}>&times;</button>
                                        <form name="addDevice" onSubmit={(event) => handleSubmit(event, close)} style={styles.form}>
                                            <label style={styles.label}>
                                                Enter device ID:
                                                <input type="text" name="deviceID" value={inputs.deviceID || ""} onChange={handleChange} style={styles.input} />
                                            </label>
                                            <label style={styles.label}>
                                                Enter device type:
                                                <input type="text" name="deviceType" value={inputs.deviceType || ""} onChange={handleChange} style={styles.input} />
                                            </label>
                                            <input type="submit" value="Submit" style={styles.submitButton} />
                                        </form>
                                    </div>
                                )}
                            </Popup>
                            <Popup trigger={<button className="bg-beige p-2 rounded text-sm">Remove Device</button>} modal nested>
                                {close => (
                                    <div className="modal" style={styles.modal}>
                                        <button onClick={close} style={styles.closeButton}>&times;</button>
                                        <form name="removeDevice" onSubmit={(event) => handleSubmit(event, close)} style={styles.form}>
                                            <label style={styles.label}>
                                                Enter device ID:
                                                <input type="text" name="deviceID" value={inputs.deviceID || ""} onChange={handleChange} style={styles.input} />
                                            </label>
                                            <input type="submit" value="Submit" style={styles.submitButton} />
                                        </form>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>
                    <DevicesBar data={[devicesData.devices, setToggleData]} />
                </div>
            </div>
            {error && (
                <Popup open={true} onClose={closeErrorPopup} modal>
                    <div className="modal" style={styles.modal}>
                        <button onClick={closeErrorPopup} style={styles.closeButton}>&times;</button>
                        <div style={styles.errorMessage}>{error}</div>
                    </div>
                </Popup>
            )}
        </div>
    );
}

export default Dashboard;
