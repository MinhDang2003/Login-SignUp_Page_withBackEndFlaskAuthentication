
import { light } from "@mui/material/styles/createPalette";
import { axiosPublic } from "../api/axios";

async function setStateDevice(roomID,devide_id,light_color,type){
    try {
        console.log(roomID,devide_id,light_color,type,3434)
        if (light_color == 0){
            light_color = type == "light"?"#000000":0
        }
        else if (light_color == 1){
            light_color = type == "light"?"#ffffff":50
        }
        else{
            light_color = type == "light"?"#c4e024":100
        }
        console.log(roomID,devide_id,light_color,type,3434)
        if (type == "fan") {
            const res = await axiosPublic.post("/api/fan",{appliance_id: devide_id, room_id: roomID,level: light_color});
            console.log(res,999)
        }
        else if (type == "light"){
            const res = await axiosPublic.post("/api/light",{appliance_id: devide_id, room_id: roomID,color: light_color});
            console.log(res)        
        }
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}
async function addDevice(roomID,devide_id,device_type){
    const res = await axiosPublic.post("/api/new_app",{appliance_id: devide_id, room_id: roomID,appliance_type: device_type});
    return res
}
async function removeDevice(roomID: any,deviceID: any){
    
    const devices = await axiosPublic.post("/api/del_app",{room_id: roomID,appliance_id: deviceID});
    return devices
}
const DevicesAPI = {setStateDevice,addDevice,removeDevice}
export default DevicesAPI;