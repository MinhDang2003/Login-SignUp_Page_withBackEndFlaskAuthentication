import { useState,useEffect } from "react";
import { Box,useTheme } from "@mui/material";
import { tokens } from "../../../theme.tsx";
import StatBox from "../../StatBox"
import TripleToggleSwitch from "../../triple";
import ReactDOM from "react-dom";

function Device(data){
    const room = data.data[0][1]
    const devices = data.data[0][0]
    
    const toggleFunction = data.data[1]
    var isOn
    if (devices.app_type=="fan"){
        isOn = Number(devices.value)/50
    }
    else if (devices.app_type=="light"){
      if (devices.value == "rgb(0,0,0)"){
        isOn = 0
      }
      else if (devices.value == "rgb(255,255,255)"){
        isOn = 1
      }
      else{
        isOn = 2
      }
    }
    
    console.log(isOn,333)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  
  

    return (
        <>
        <Box
        sx={{ width:'200px',borderRadius:'15%', margin: '15px 10px 15px 10px' }}
        backgroundColor={isOn? colors.primary[300]:colors.primary[900]}
        display="flex"
        alignItems="center"
        justifyContent="center"
        id = {devices.app_id}
        
      >
        <div>
                        <input className="form-check-input" type="checkbox" role="switch" checked={isOn==0} id={devices.app_id+"0"}
                onChange={(e) => {
                    toggleFunction([room,devices.app_id,0,devices.app_type])
                }}
                />
                <input className="form-check-input" type="checkbox" role="switch" checked={isOn==1} id={devices.app_id+"1"}
                onChange={(e) => {
                    toggleFunction([room,devices.app_id,1,devices.app_type])
                }}
                />
                <input className="form-check-input" type="checkbox" role="switch" checked={isOn==2} id={devices.app_id+"2"}
                onChange={(e) => {
                    toggleFunction([room,devices.app_id,2,devices.app_type])
                }}
                />
        </div>
                
        <StatBox
          title={devices.app_id}
          subtitle={isOn!=0? "On":"Off"}
          status = {isOn}
          icon=
            {devices.icon}
          
        />
      </Box>
        </>
    )
}
export default Device;