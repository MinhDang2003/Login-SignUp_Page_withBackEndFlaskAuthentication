import { axiosPublic } from "../api/axios";

async function getAllRooms() {
    try{
        const roomsData = await axiosPublic.get("/api/getAllRoom");
        return roomsData
    }
    catch (err) {
        return {}
    }
}
async function getDevicesByRoomID(roomID){
    try{
        const devices = await axiosPublic.post("/api/getRoom",{room_id: roomID});
        return devices
    } 
    catch (err) {
        return {}
    }
}
async function addRoom(roomID: any){
        const devices = await axiosPublic.post("/api/new_room",{room_id: roomID});
        return devices
}
async function removeRoom(roomID: any){
    const devices = await axiosPublic.post("/api/del_room",{room_id: roomID});
    return devices
}

const RoomsAPI = {getAllRooms,getDevicesByRoomID,addRoom,removeRoom} 
export default RoomsAPI