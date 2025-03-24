import Container from '@mui/material/Container'

import { useNavigate, Navigate } from 'react-router-dom'
import SimpleModal from '../componants/Modal'
import { useEffect, useRef, useState } from 'react'
import { Grid, Typography, Button, Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useSelector, useDispatch } from 'react-redux'
import { credentialActions } from '../store/student-credentials'
import ErrorModal from '../componants/ErrorModal'
import EmptyErrorModal from '../componants/EmptyErrorModal'
import { SocketHandler } from '../handleSocket'
import { purgePersistedData } from '../store/index'
import { persistor } from '../store/index'

function JoinPage() {
  const socket_handler = SocketHandler.getInstance()
  const [passwordLogin, setIsPasswordLogin] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const student_id = useSelector((state) => state.cred.exam_id) //exam id not student id
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    univ_id: '',
    nat_id: '',
    pass: '',
  })
  const BASE_URL = 'http://' + window.location.host.split(':')[0] + ':3031/api/'

  const credentials = useSelector((state) => state.cred.credential)
  // console.log(credentials);
  // console.log(student_id);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false)

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const toggleLogin = () => {
    setIsPasswordLogin((prevCheck) => !prevCheck)
  }

  const openEmptyModal = () => {
    setIsEmptyModalOpen(true)
  }

  const closeEmptyModal = () => {
    setIsEmptyModalOpen(false)
  }

  const openErrorModal = () => {
    setIsErrorModalOpen(true)
  }

  const closeErrorModal = () => {
    setIsErrorModalOpen(false)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    localStorage.removeItem('persist:root')

    persistor.purge()
    purgePersistedData()
    localStorage.removeItem('timerTime')
  }, [])

  const handleOpen = () => {
    const enteredName = nameInputRef.current?.value
    const enteredEmail = emailInputRef.current?.value
    const enteredUniv = univInputRef.current?.value
    const enteredNat = natInputRef.current?.value

    const enteredPass = passInputRef.current?.value
    var nonEmptyNameField = false
    var nonEmptyEmailField = false
    var nonEmptyUnivField = false
    var nonEmptyNatField = false
    var nonEmptyPassField = false

    var validEmail = isValidEmail(enteredEmail)

    if (!passwordLogin) {
      nonEmptyNameField = enteredName.trim().length !== 0 ? true : false
      nonEmptyEmailField =
        enteredEmail.trim().length !== 0 && !passwordLogin ? true : false
      nonEmptyUnivField = enteredUniv.trim().length !== 0 ? true : false
      nonEmptyNatField = enteredNat.trim().length !== 0 ? true : false
      // const nonEmptyPassField = enteredPass.trim().length !== 0 ? true : false;
    } else {
      nonEmptyNameField = enteredName.trim().length !== 0 ? true : false
      nonEmptyUnivField = enteredUniv.trim().length !== 0 ? true : false
      nonEmptyPassField = enteredPass.trim().length !== 0 ? true : false
    }

    const isValidNormalEntry =
      nonEmptyNameField &&
      nonEmptyEmailField &&
      nonEmptyUnivField &&
      nonEmptyNatField &&
      validEmail

    const isValidPasswordEntry =
      nonEmptyNameField && nonEmptyUnivField && nonEmptyPassField

    if (isValidNormalEntry && !passwordLogin) {
      setFormData({
        name: enteredName,
        email: enteredEmail,
        univ_id: enteredUniv,
        nat_id: enteredNat,
        pass: '',
      })

      setIsModalOpen(true)
    } else if (!isValidNormalEntry && !passwordLogin) {
      if (validEmail || !nonEmptyEmailField) {
        openEmptyModal()
      } else {
        setError('Invalid Email Format')
        setIsErrorModalOpen(true)
        handleClose()
      }

      // openEmptyModal()
    } else if (isValidPasswordEntry && passwordLogin) {
      setFormData({
        name: enteredName,
        email: '',
        univ_id: enteredUniv,
        nat_id: '',
        pass: enteredPass,
      })
      setIsModalOpen(true)
    } else {
      openEmptyModal()
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const nameInputRef = useRef()
  const natInputRef = useRef()
  const univInputRef = useRef()
  const emailInputRef = useRef()
  const passInputRef = useRef()

  const [error, setError] = useState(null)

  const exam_id = localStorage.getItem('exam_id')

  const submitHandler = async (event) => {
    // console.log("ji")
    try {
      event.preventDefault()
      setError(null)
      const enteredName = nameInputRef.current?.value
      const enteredEmail = emailInputRef.current?.value
      const enteredUniv = univInputRef.current?.value
      const enteredNat = natInputRef.current?.value
      const enteredPass = passInputRef.current?.value

      // console.log("Hi")

      // console.log(enteredName)

      // console.log(enteredName, enteredEmail, enteredUniv, enteredNat);
      if (!passwordLogin) {
        dispatch(
          credentialActions.insertCredentials({
            name: enteredName,
            email: enteredEmail,
            univ_id: enteredUniv,
            nat_id: enteredNat,
          })
        )
      } else {
        dispatch(
          credentialActions.insertCredentials({
            name: enteredName,
            univ_id: enteredUniv,
          })
        )
      }

      // put request
      const response = !passwordLogin
        ? await fetch(BASE_URL + 'student/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              name: enteredName,
              email: enteredEmail,
              id: enteredUniv,
              national_id: enteredNat,
              exam_id: exam_id,
            }),
          })
        : await fetch(BASE_URL + 'student/login_by_password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: enteredName,
              id: enteredUniv,
              exam_password: enteredPass,
              exam_id: exam_id,
            }),
          })

      const responseData = await response.json()

      // console.log(responseData)

      if (!response.ok) {
        throw new Error(
          `status: ${response.status} description: ${responseData.error} `
        )
      } else {
        localStorage.setItem('student_id', enteredUniv)
        localStorage.setItem('token', responseData.token)

        socket_handler.connectToServer()
        socket_handler.joinExam(exam_id, enteredUniv)
        navigate('/wait', { replace: true })
      }
    } catch (error) {
      console.log(error)

      setError(error.message)
      setIsErrorModalOpen(true)
      handleClose()
    }
  }

  const setErrorFalse = () => {
    setError(null)
  }

  const isSigned = credentials.length > 0 ? true : false
  // console.log(isSigned);

  return (
    <>
      {/* <button onClick={handleOpen}>Open modal</button> */}
      <SimpleModal
        submitHandler={submitHandler}
        data={formData}
        isOpen={isModalOpen}
        onClose={closeModal}
        passwordLogin={passwordLogin}
      />
      <ErrorModal
        errorMsg={error}
        isOpen={isErrorModalOpen}
        onClose={closeErrorModal}
      />
      <EmptyErrorModal isOpen={isEmptyModalOpen} onClose={closeEmptyModal} />

      <Container
        maxWidth='sm'
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #eee',
          boxShadow: '0px 2px 5px 2px rgb(0 0 0 / 5%)',
          marginTop: '20px',
          backgroundColor: '#fff',
        }}
      >
        {/* <SimpleModal isOpen={isModalOpen} onClose={closeModal} /> */}

        {/* {error ? (
          <Button
            variant="contained"
            sx={{ width: "100%", color: "red" }}
            onClick={setErrorFalse}
          ></Button>
        ) : null} */}
        <Box align='center' sx={{ marginBottom: '5px' }}>
          <Typography
            sx={{ color: '#555', marginTop: '35px', marginBottom: '45px' }}
            variant='h6'
          >
            Please Enter Your Identity Information
          </Typography>
        </Box>

        <Box
          sx={{
            marginTop: '20px',
            marginBottom: '50px',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <form id='join-form' onSubmit={submitHandler}>
            <Grid
              sx={{ marginBottom: '30px' }}
              container
              justifyContent='space-around'
              direction='row'
            >
              <TextField
                sx={{ width: '75%' }}
                inputRef={nameInputRef}
                id='name'
                label='Student Name'
                variant='filled'
                required
              />
            </Grid>

            {!passwordLogin ? (
              <Grid
                sx={{ marginBottom: '30px' }}
                container
                justifyContent='space-around'
                direction='row'
              >
                <TextField
                  id='nat'
                  label='National-ID'
                  variant='filled'
                  inputRef={natInputRef}
                  sx={{ width: '75%' }}
                  required
                />
              </Grid>
            ) : null}

            <Grid
              sx={{ marginBottom: '30px' }}
              container
              justifyContent='space-around'
              direction='row'
            >
              <TextField
                id='univ'
                label='University-ID'
                variant='filled'
                sx={{ width: '75%' }}
                required
                inputRef={univInputRef}
              />
            </Grid>

            {!passwordLogin ? (
              <Grid container justifyContent='space-around' direction='row'>
                <TextField
                  id='mail'
                  label='Email'
                  type='email'
                  variant='filled'
                  sx={{ width: '75%' }}
                  required
                  inputRef={emailInputRef}
                />
              </Grid>
            ) : null}

            {passwordLogin ? (
              <Grid container justifyContent='space-around' direction='row'>
                <TextField
                  id='outlined-password-input'
                  label='Password'
                  type='password'
                  variant='filled'
                  sx={{ width: '75%' }}
                  required
                  inputRef={passInputRef}
                />
              </Grid>
            ) : null}

            <Button
              align='center'
              variant='contained'
              onClick={handleOpen}
              sx={{
                marginTop: '30px',
                borderRadius: '2px',
                paddingTop: '10px',
                paddingBottom: '10px',
                backgroundColor: '#36aafd',
                width: '100%',
                marginBottom: '30px',
              }}
            >
              Submit and Enter the Test
            </Button>
          </form>
          <Button onClick={toggleLogin} variant='text'>
            {!passwordLogin ? 'Login using Password' : 'Normal Login'}
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default JoinPage
