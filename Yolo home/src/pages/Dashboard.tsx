import {Link } from "react-router-dom";
import Users from "../component/Users";
import { useTheme } from "@mui/material";
import { useEffect, useState } from 'react'
import Sidebarr from "../component/Sidebar";
import {getAllRoomsData,getDevicesOfRoom,toggleDevice} from '../business/HomePageData'
import RoomBar from '../component/bars/rooms/RoomsBar'
import DevicesBar from '../component/bars/devices/DevicesBar'
import { tokens } from "../theme.tsx";

function Dashboard() {
	const [count, setCount] = useState(0)
    const [data, setData] = useState([])
    const [selectedRoom, setSelectedRoom] = useState("0")
    const [toggleData,setToggleData] = useState(null)
    const [devicesData, setDevicesData] = useState({signal:[],devices:[]})
    useEffect(()=>{
      const getData = async () => {
        const res = await getAllRoomsData()
        setData(res)
        setSelectedRoom(res[0].room_id)
      }
      getData()
    }, []
    )
    useEffect(()=> {
      const getData = async () => {
		console.log(selectedRoom,444)
        const res = await getDevicesOfRoom(selectedRoom)
		console.log(res,3575)
        if (selectedRoom != "0") setDevicesData(res);
      }
      getData()
    },[selectedRoom,count])
  
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
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
	return (
		<div className=" flex h-screen w-screen min-h-screen items-start overflow-y-auto">
			<div className="sticky h-screen left-0 top-0" >
				<Sidebarr />
			</div>
			<div className=" grow body w-screen h-screen ">
				<h1 className="text-black font-serif text-center text-7xl">Dashboard</h1>
				<div className="flex flex-wrap justify-center field1 bg-[#DAC0A3] shadow-xl">
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Add Room</h1>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Add Device</h1>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Remove Room</h1>
					</div>
					<div className="flex flex-col p-0 mx-auto justify-center h-64 w-64 items-center field1Item rounded-3xl bg-black">
						<h1>Remove Device</h1>
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
				</div>
			</div>
		</div>
	);
}
export default Dashboard;
