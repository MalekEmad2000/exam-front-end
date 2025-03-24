import Container from '@mui/material/Container'
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from '@mui/material'
import { flushSync } from 'react-dom'

import { SocketHandler } from '../handleSocket'

import DoneIcon from '@mui/icons-material/Done'
import { useEffect } from 'react'

const socket_handler = SocketHandler.getInstance()

function EndPage() {
  // function getError(){
  //   flushSync(()=>{

  //     const error = localStorage.getItem('error');
  //     console.log(error);
  //       // localStorage.removeItem('error');

  //       return error;

  //   })

  // }

  // const error =getError();

  // localStorage.removeItem('error');

  useEffect(() => {
    socket_handler.diconnectSocket()
  }, [])

  return (
    <Container
      maxWidth='sm'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #eee',
        boxShadow: '0px 2px 5px 2px rgb(0 0 0 / 5%)',
        marginTop: '20px',
        backgroundColor: '#fff',
        minHeight: '450px',
      }}
    >
      <Box align='center' sx={{ marginBottom: '5px' }}>
        <Typography
          sx={{
            color: '#666',
            marginBottom: '20px',
            paddingTop: '25px',
            marginTop: '20px',
          }}
          variant='h4'
        >
          Exam Has ended
        </Typography>
        {localStorage.getItem('error') ? (
          <Typography sx={{ color: '#36aafd', marginTop: '20px' }} variant='h6'>
            {`Error ${localStorage.getItem('error')}`}
          </Typography>
        ) : (
          <Typography sx={{ color: '#36aafd', marginTop: '20px' }} variant='h6'>
            Thank you and Good Luck
          </Typography>
        )}
      </Box>
    </Container>
  )
}

export default EndPage
