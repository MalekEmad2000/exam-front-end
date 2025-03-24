import Container from '@mui/material/Container'
import image from './download.jpg'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import CircularIndeterminate from '../componants/Loading'

import { Grid, Typography, Button, Box } from '@mui/material'
import Divider from '@mui/material/Divider'
import { credentialActions } from '../store/student-credentials'
import { useSelector, useDispatch } from 'react-redux'

import { persistor } from '../store/index'

function HomePage() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '80%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }
  const BASE_URL = 'http://' + window.location.host.split(':')[0] + ':3031/api/'
  const [examParemters, setExamParemeters] = useState([])
  const navigate = useNavigate()
  const student_id = useSelector((state) => state.cred)
  const dispatch = useDispatch()
  const credentials = useSelector((state) => state.cred.credential)
  const isSigned = credentials.length > 0 ? true : false

  localStorage.removeItem('error') //cleanup error if present
  localStorage.removeItem('timerTime')
  localStorage.removeItem('persist:root');

  const time1 = new Date('1970-01-01T' + examParemters.starting_time + 'Z')
  const time2 = new Date('1970-01-01T' + examParemters.ending_time + 'Z')

  const diffInMilliseconds = Math.abs(time2.getTime() - time1.getTime())
  const diffInMinutes = Math.floor(diffInMilliseconds / 1000 / 60)

  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchParameters = async () => {
      setLoading(true)
      setError(null)
      // setTimeoutRemaining(null);
      try {
        console.log(BASE_URL)
        const response = await fetch(
          BASE_URL + 'exam/' + searchParams.get('e'),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const responseData = await response.json()

        if (!response.ok) {
          // const errorResponse = await response.json();
          console.log(responseData)
          throw new Error(responseData.error)

          // throw new Error(errorResponse.message);
        }
        console.log(responseData)
        setExamParemeters(responseData)
        setLoading(false)
      } catch (error) {
        console.log(error.message)
        setLoading(false)
        setError(error.message)
      }
    }

    fetchParameters()
  }, [])

  if (loading) {
    return (
      <div style={{ margin: 'auto', width: '60%' }}>
        <CircularIndeterminate />
      </div>
    )
  }

  if (error) {
    return (
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Error
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }}>
          {error}
        </Typography>
      </Box>
    )
  }

  const clickHandler = () => {
    // console.log(examParemters);

    localStorage.setItem('mins', diffInMinutes.toString())
    localStorage.setItem('exam_id', searchParams.get('e'))
    dispatch(credentialActions.insertExamId(searchParams.get('e')))
    persistor.purge()

    navigate('/join', { replace: true })
  }

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
    }}
  >
    <Box align="center" sx={{ marginBottom: "5px" }}>
      <img src={image} style={{ width: "40%", marginTop: "50px" }} />
      <Typography
        sx={{ color: "#666", marginBottom: "20px" }}
        variant="subtitle1"
      >
        Mobile Exam Solution
      </Typography>
      <Typography sx={{ color: "#36aafd", marginTop: "20px" }} variant="h5">
        {examParemters.course_name+" ("+examParemters.course_code+")"}
      </Typography>
      <Typography sx={{ color: "#666", marginTop: "10px" }} variant="h6">
        {examParemters.name}
      </Typography>
    </Box>

    <Box
      sx={{
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
       <Grid container spacing={2}>
    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#666",
          paddingBottom: "5px",
          // width: "150px", // Add fixed width
          textAlign: "left",
        }}
        variant="body1"
      >
        Starting Time:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#333",
          paddingBottom: "5px",
          fontWeight: "bold",
          // width: "150px", // Add fixed width
          textAlign: "right", // Set textAlign property
        }}
        variant="body1"
      >
        {examParemters?.starting_time}
      </Typography>
    </Grid>
    <Divider sx={{ width: "100%" }} />

    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#666",
          paddingBottom: "5px",
          paddingTop: "5px",
          // width: "150px", // Add fixed width
          textAlign: "left",
        }}
        variant="body1"
      >
        Ending Time:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#333",
          paddingBottom: "5px",
          paddingTop: "5px",
          fontWeight: "bold",
          // width: "150px", // Add fixed width
          textAlign: "right", // Set textAlign property
        }}
        variant="body1"
      >
        {examParemters?.ending_time}
      </Typography>
    </Grid>
    <Divider sx={{ width: "100%" }} />

    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#666",
          paddingBottom: "5px",
          paddingTop: "5px",
          // width: "150px", // Add fixed width
          textAlign: "left",
        }}
        variant="body1"

      >
        Min Submit Time:
      </Typography>
    </Grid>
    
    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#333",
          paddingBottom: "5px",
          paddingTop: "5px",
          fontWeight: "bold",
          // width: "150px", // Add fixed width
          textAlign: "right", // Set textAlign property
        }}
        variant="body1"
      >
        {examParemters.min_submit_time}
      </Typography>
    </Grid>
    <Divider sx={{ width: "100%" }} />

    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#666",
          paddingBottom: "5px",
          paddingTop: "5px",
          // width: "150px", // Add fixed width
          textAlign: "left",
        }}
        variant="body1"
      >
        Time Limit:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#333",
          paddingBottom: "5px",
          paddingTop: "5px",
          fontWeight: "bold",
          // width: "150px", // Add fixed width
          textAlign: "right", // Set textAlign property
        }}
        variant="body1"
      >
        {diffInMinutes} minutes
      </Typography>

    </Grid>
    <Divider sx={{ width: "100%" }} />



    <Grid item xs={6}>
      
      <Typography
        sx={{
          color: "#666",
          paddingBottom: "5px",
          paddingTop: "5px",
          // width: "150px", // Add fixed width
          textAlign: "left",
        }}
        variant="body1"
      >
        Professor name:
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography
        sx={{
          color: "#333",
          paddingBottom: "5px",
          paddingTop: "5px",
          fontWeight: "bold",
          // width: "150px", // Add fixed width
          textAlign: "right", // Set textAlign property
        }}
        variant="body1"
      >
        {examParemters.professor_name}
      </Typography>
    </Grid>
  </Grid>










      <Divider />

      <Typography
        sx={{ color: "#666", paddingBottom: "5px", paddingTop: "5px" }}
        variant="body1"
      >
        {examParemters.instructions}
      </Typography>
      <Divider />

     


    </Box>

    <Button
      onClick={clickHandler}
      align="center"
      variant="contained"
      sx={{
        marginTop: "30px",
        borderRadius: "2px",
        paddingTop: "10px",
        paddingBottom: "10px",
        backgroundColor: "#36aafd",
        width: "100%",
        marginBottom: "50px",
      }}
    >
      Start The test
    </Button>
  </Container>
    




  )
}

export default HomePage
