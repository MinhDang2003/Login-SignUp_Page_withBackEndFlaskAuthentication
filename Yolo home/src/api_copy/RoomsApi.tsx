import { axiosPublic } from "../api/axios";

async function getAllRooms() {
    try{
        const roomsData = await axiosPublic.get("/api/getAllRoom");
        return roomsData
    }
    catch (err) {
        console.log(err)
        return {}
    }
}
async function getDevicesByRoomID(roomID){
    try{
        const devices = await axiosPublic.post("/api/getRoom",{room_id: roomID});
        return devices
    } 
    catch (err) {
        console.log(err)
        return {}
    }
}

const RoomsAPI = {getAllRooms,getDevicesByRoomID} 
export default RoomsAPI