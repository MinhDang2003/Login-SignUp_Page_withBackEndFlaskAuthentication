import RoomCard from "./RoomCard";
import { useState } from "react";
import { Box,useTheme } from "@mui/material";
import { tokens } from "../../../theme.tsx";

function RoomBar(data:any){
    let rooms = data.data[0].map((item)=>({"room_id":item.room_id,"selected":item.selected,"devices":item.devices}))
    const viewmore  = rooms.length > 4
    const [viewAll,setViewAll] = useState(false)
    const numDisplay = viewmore?4:rooms.length
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <>
        <Box
        component="section"
        className="row d-flex ms-2"
        display="flex"
        flexWrap="wrap"
        justifyContent="start"
        gridColumn="span 12"
        gridRow="span 1"
        style={{backgroundColor:colors.primary[400]}}
        >
        {
                rooms.slice(0,viewAll?rooms.length:numDisplay).map((item)=> (
                    <RoomCard data={[item, data.data[1], data.data[2]]} />

                ))
            }
        </Box>
        </>
    )
}
export default RoomBar