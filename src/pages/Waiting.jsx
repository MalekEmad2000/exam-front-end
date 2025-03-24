import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { Typography, Box } from "@mui/material";

function WaitingPage() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "75%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("navigateToExam", (e) => {
      navigate("/exam", { replace: true });
    });
    return () => {
      window.removeEventListener("navigateToExam", (e) => {
        navigate("/exam", { replace: true });
      });
    };
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #eee",
        boxShadow: "0px 2px 5px 2px rgb(0 0 0 / 5%)",
        marginTop: "20px",
        backgroundColor: "#fff",
        minHeight: "500px",
        height: "80%",
      }}
    >
      <Box align="center" sx={{ marginBottom: "40px" }}>
        <Typography sx={{ color: "#36aafd", marginTop: "50px" }} variant="h6">
          Waiting For Exam To Start
        </Typography>
      </Box>

      <Box
        align="center"
        sx={{
          marginTop: "20px",
          marginBottom: "20px",
          marginLeft: "10px",
          marginRight: "10px",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
}

export default WaitingPage;
