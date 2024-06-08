import Device from "./Device";
import { Box,useTheme } from "@mui/material";
import { tokens } from "../../../theme.tsx";
function DevicesBar(data) {
    console.log(data.data,22334)
    const devices = data.data[0]
    const toggleFunction = data.data[1]
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
    <>
        <Box
          className="row d-flex ms-2"
          display="flex"
          flexWrap="wrap"
          justifyContent="start"
                    gridColumn="span 12"
                    gridRow="span 1"
        >
        {
            devices.map((item)=> <Device data={[item,toggleFunction]}></Device>)
        }
        </Box>

    </>
   )
}
export default DevicesBar;