import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

function CircularIndeterminate() {
  return (
    <Box

      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection:"column",
        alignItems: "center",
        border: "1px solid #eee",
        boxShadow: "0px 2px 5px 2px rgb(0 0 0 / 5%)",
        marginTop: "20px",
      }}
    >
        <Box sx={{marginTop:"20px"}}>
        <CircularProgress />


        </Box>

      <Typography
          sx={{ color: "#666", marginBottom: "20px",marginTop:"20px" }}
          variant="subtitle1"
        >
          Fetching Data ......
        </Typography>
    </Box>
  );
}

export default CircularIndeterminate;
