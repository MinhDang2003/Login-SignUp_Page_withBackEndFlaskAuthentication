import { useState,useEffect } from "react";
import { Box,useTheme } from "@mui/material";
import { tokens } from "../../../theme.tsx";
import StatBox from "../../StatBox"
import TripleToggleSwitch from "../../triple";
import ReactDOM from "react-dom";
import fan_image from "../../../assets/dashboard/fan.png"
import light_image from "../../../assets/dashboard/idea.png"

function Device(data){
    const room = data.data[0][1]
    const devices = data.data[0][0]
    let deviceImage;
    if (devices.app_type === "fan") {
        deviceImage = fan_image;
    } else if (devices.app_type === "light") {
        deviceImage = light_image;
    }
    const toggleFunction = data.data[1]
    let isOn;
    let subtitle;
    if (devices.app_type === "fan") {

        if (devices.value === 0) {
            isOn = 0;
            subtitle = "Off";
        } else if (devices.value === 50) {
            isOn = 1;
            subtitle = "Half";
        } else {
            isOn = 2;
            subtitle = "Full";
        }
    } else if (devices.app_type === "light") {
        if (devices.value === "#000000") {
            isOn = 0;
            subtitle = "Off";
        } else if (devices.value === "#ffffff") {
            isOn = 1;
            subtitle = "White";
        } else {
            isOn = 2;
            subtitle = "Yellow";
        }
    }
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  
  

    return (
        <>
        <Box
        sx={{ width:'200px',borderRadius:'15%', margin: '15px 10px 15px 10px' }}
        backgroundColor={isOn? colors.greenAccent[300]:"#F8F0E5"}
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
                    subtitle={subtitle}
                    status={isOn}
                    icon={<img src={deviceImage} alt={devices.app_type} style={{ width: '50px', height: '50px' }} />}
                />
      </Box>
        </>
    )
}
export default Device;