import { AppBar, Box, Toolbar, styled, Typography,Button } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import { useState, useEffect } from "react";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const TimerBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));

function NavBar({submit,returnToAnswering,answering}) {
  // const [days, setDays] = useState(0);
  // const [hours, setHours] = useState(0);
  // const [minutes, setMinutes] = useState(0);
  // const [seconds, setSeconds] = useState(0);
  // const dead_line = new Date(2023, 0, 6, 21, 0);
  const [totalTime, setTotalTime] = useState(Number(localStorage.getItem('mins')) * 60 * 1000); // n minutes

  const [initialTime, setInitialTime] = useState(() => {
    const storedTime = localStorage.getItem('timerTime');
    return storedTime ? new Date(storedTime) : new Date();
  });

  const [elapsedTime, setElapsedTime] = useState(() => {
    const storedTime = localStorage.getItem('timerTime');
    return storedTime ? Date.now() - new Date(storedTime).getTime() : 0;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - initialTime);
    }, 1000);
    return () => clearInterval(timer);
  }, [initialTime]);
  

  useEffect(() => {
    
      localStorage.setItem('timerTime', new Date(initialTime).toString());
    
  }, [initialTime]);

  // function handleTimerComplete() {
  //   localStorage.removeItem('timerTime');
  //   localStorage.removeItem('mins');

  //   // Do something when the timer is complete
  //   submit();
  // }

  const timeLeft = totalTime - elapsedTime;

  const remainingTime = Math.max(0, timeLeft); // Ensure remaining time is non-negative


  
  const minutes = Math.floor(remainingTime / 1000 / 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  







  // const getTime = () => {
  //   const time = dead_line - Date.now();

  //   setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
  //   setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
  //   setMinutes(Math.floor((time / 1000 / 60) % 60));
  //   setSeconds(Math.floor((time / 1000) % 60));
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => getTime(dead_line), 1000);

  //   return () => clearInterval(interval);
  // }, []);
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          Mobile Exam
        </Typography>
        {/* <Typography>Switching Theory</Typography> */}
        {/* <TimerBox sx={{gap:"0px"}}>
          <ListIcon/>

        <Typography>Questions</Typography>


        </TimerBox> */}

        <TimerBox>
        <Button onClick={returnToAnswering} sx={{color: "#fff",border: "1px solid #fff"}}>{answering?"Exam Progress":"To Exam"}</Button>

          <TimerIcon />
          <Typography>
          {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </Typography>
        </TimerBox>
      </StyledToolbar>
    </AppBar>
  );
}

// Add a prop which contains exam start and end date in additiion to exam title
export default NavBar;
