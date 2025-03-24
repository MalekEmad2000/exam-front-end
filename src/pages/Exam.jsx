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
} from "@mui/material";
import NavBar from "../componants/NavBar";
import Question from "../componants/Question";
import { flushSync } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { persistor } from "../store/index";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import QuestionList from "../componants/QuestionList";
import { SocketHandler } from "../handleSocket";
import Divider from "@mui/material/Divider";

import ErrorModal from "../componants/ErrorModal";
import SubmitErrorModal from "../componants/SubmitErrorModal";

const socket_handler = SocketHandler.getInstance();

function ExamPage() {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [error1, setError1] = useState(null);

  const [isErrorSubmitModalOpen, setIsErrorSubmitModalOpen] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(null);

  const [isErrorVisibilityModalOpen, setIsErrorVisibilityModalOpen] =
    useState(false);
  // const [errorSubmit, setErrorSubmit] = useState(null)

  const credentials = useSelector((state) => state.cred.credential);
  const bookmarks = useSelector((state) => state.bookmark.bookmarks);

  const isSigned = credentials.length > 0 ? true : false;
  const [examEnd, setExamEnd] = useState(false);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const navigate = useNavigate();
  const [answering, setAnswering] = useState(true);

  const [scrollQuestion, setScrollQuestion] = useState(null);

  const buttonRef = useRef(null);
  const [error, setError] = useState(null);
  const [timeoutRemaining, setTimeoutRemaining] = useState(null);

  const ref = useRef(null);
  const [sectionsList, setSectionsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const answers = useSelector((state) => state.answers.answers);
  const student_id = useSelector((state) => state.cred);

  const returnToAnswering = () => {
    setAnswering((prevCheck) => !prevCheck);

    // setAnswering(true)
  };
  const BASE_URL =
    "http://" + window.location.host.split(":")[0] + ":3031/api/";

  const sectionChanger = (section_id, question_id) => {
    // console.log(section_isd);
    setCurrentSectionIndex(section_id);

    setAnswering((prevCheck) => !prevCheck);

    setScrollQuestion(question_id);
    console.log(question_id);
  };

  const handlePreviousClick = () => {
    setCurrentSectionIndex(currentSectionIndex - 1);
    const element = document.getElementById("hero-section");
    if (element) {
      //  Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNextClick = () => {
    setCurrentSectionIndex(currentSectionIndex + 1);
    const element = document.getElementById("hero-section");
    if (element) {
      //  Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const examHasEnded = () => {
    // setCurrentSectionIndex(sectionsList.length - 1)

    // const button = buttonRef.current;
    // button.click();
    submit();
  };
  const pageHidden = () => {
    if (document.hidden) {
      // The page is hidden
      setIsErrorVisibilityModalOpen(true);

      socket_handler.diconnectSocket();
      // setIsErrorVisibilityModalOpen(true)

      // navigate('/join', { replace: true })
    }
  };

  const submit = async (event) => {
    // event.preventDefault();
    localStorage.removeItem("timerTime");
    localStorage.removeItem("mins");
    try {
      const response = await fetch(BASE_URL + "student/logout", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `status: ${response.status} description: ${responseData.error} `
        );
      }
      if (response.ok) {
        persistor.purge();
        navigate("/end", { replace: true });
      }
    } catch (error) {
      setErrorSubmit("Failed to Submit Not Connected to Server");
      setIsErrorSubmitModalOpen(true);

      // navigate('/join', { replace: true })
    }
  };
  const handler = () => {
    navigate("/join", { replace: true });
  };
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  useEffect(() => {
    const fetchParameters = async () => {
      setIsLoading(true);
      setError(null);
      setTimeoutRemaining(null);
      try {
        const response = await fetch(BASE_URL + "student/exam", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        flushSync(() => {
          setSectionsList(responseData);
          setIsLoading(false);
        });
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setError(error.message);

        // Retry after 2 minutes
        let remainingTime = 120;
        setTimeoutRemaining(remainingTime);
        const intervalId = setInterval(() => {
          remainingTime -= 1;
          setTimeoutRemaining(remainingTime);
          if (remainingTime <= 0) {
            clearInterval(intervalId);
            setTimeout(fetchParameters, 0);
          }
        }, 1000);
      }
    };
    fetchParameters();
    document.addEventListener("visibilitychange", pageHidden);

    window.addEventListener("navigateToEnd", submit);

    return () => {
      window.removeEventListener("navigateToEnd", submit);
      document.removeEventListener("visibilitychange", pageHidden);
    };
  }, []);

  useEffect(() => {
  
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [scrollQuestion, ref, answering]);

  if (isLoading) {
    return (
      <section>
        <p>Loading...............</p>
      </section>

      // <Backdrop
      //   sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      // >
      //   <CircularProgress color="inherit" />
      // </Backdrop>
    );
  }
  // console.log("-------------------------------------------");

  // console.log(sectionsList);

  if (error) {
    return (
      <div style={{ margin: "auto", width: "60%" }}>
        Error: {error}
        {timeoutRemaining !== null && (
          <div>Retrying in {timeoutRemaining} seconds...</div>
        )}
      </div>
    );
  }

  return (
    <>
      <Box>
        <NavBar
          submit={examHasEnded}
          setCurrentSectionIndex={setCurrentSectionIndex}
          answering={answering}
          returnToAnswering={returnToAnswering}
        />
        <ErrorModal
          errorMsg={error1}
          isOpen={isErrorModalOpen}
          onClose={closeErrorModal}
        />
        <SubmitErrorModal
          errorMsg={`Failed to Submit Not Connected to Server`}
          isOpen={isErrorSubmitModalOpen}
          onClose={setIsErrorSubmitModalOpen}
          errorHandler={handler}
        />

        <SubmitErrorModal
          errorMsg={`Page is Hidden`}
          isOpen={isErrorVisibilityModalOpen}
          onClose={setIsErrorVisibilityModalOpen}
          errorHandler={handler}
        />
        <Box
          sx={{
            marginBottom: "25px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
          }}
          alignItems="center"
        >
          <div id="hero-section"></div>
          <Grid
            maxWidth="lg"
            sx={{
              paddingLeft: "10px",
              marginTop: "5px",
              border: "3px solid #000",
              borderRadius: "5px",
            }}
            container
            justifyContent="center"
            direction="row"
          >
            <Typography
              sx={{
                color: "#666",
                paddingBottom: "5px",
                paddingRight: "5px",
                float: "left",
              }}
              variant="h6"
              align="left"
            >
              Name: {student_id.credential[0].name}
            </Typography>
            <Typography
              sx={{ color: "#333", paddingLeft: "5px", paddingBottom: "5px" }}
              variant="h6"
              align="right"
            >
              ID: {student_id.credential[0].univ_id}
            </Typography>
          </Grid>
          <Divider />

          <Grid
            maxWidth="lg"
            sx={{ paddingLeft: "10px", marginTop: "5px" }}
            container
            justifyContent="center"
            direction="row"
          >
            {answering ? (
              <>
                <Typography
                  sx={{
                    color: "#666",
                    paddingBottom: "5px",
                    paddingRight: "5px",
                    float: "left",
                  }}
                  variant="h6"
                  align="left"
                >
                  Section Title :
                </Typography>
                <Typography
                  sx={{
                    color: "#333",
                    paddingLeft: "5px",
                    paddingBottom: "5px",
                  }}
                  variant="h6"
                  align="right"
                >
                  {sectionsList[currentSectionIndex].section_title}
                </Typography>
              </>
            ) : null}
          </Grid>
          <Divider />

          <Grid
            maxWidth="lg"
            sx={{
              paddingLeft: "5px",
              marginTop: "10px",
              boxShadow:
                "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
            }}
            display="flex"
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            {answering ? (
              sectionsList[currentSectionIndex].questions.map(
                (question, index) => {
                  // let isBookamrked = false;

                  // const bookmark = bookmarks.filter(
                  //   (element) =>
                  //     element.question_id === question.question_id &&
                  //     element.section_id === sectionsList[currentSectionIndex].section_id
                  // );
                  // if (bookmark.length > 0) {
                  //   isBookamrked = true;
                  // } else {
                  //   isBookamrked = false;
                  // }

                  let shouldScroll = false;

                  if (scrollQuestion === question.question_id) {
                    shouldScroll = true;
                    console.log(scrollQuestion);
                  }

                  return (
                    <Question
                      question={question}
                      currentQuestion={index + 1}
                      currentSection={
                        sectionsList[currentSectionIndex].section_id
                      }
                      id={question.question_id}
                      isBookmarked={false}
                      ref={shouldScroll ? ref : null}
                    />
                  );
                }
              )
            ) : (
              <QuestionList
                setCurrentSectionIndex={sectionChanger}
                answering={answering}
                returnToAnswering={returnToAnswering}
                sectionList={sectionsList}
              />
            )}

            {/* <QuestionList sectionList={sectionsList}/> */}
          </Grid>
        </Box>

        {answering ? (
          <Box
            sx={{
              marginBottom: "25px",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
            alignItems="flex-end"
          >
            {currentSectionIndex === 0 ? null : (
              <Button
                onClick={handlePreviousClick}
                variant="contained"
                sx={{ width: "30%", marginRight: "10px" }}
              >
                Previous Section
              </Button>
            )}
            <Button
              ref={buttonRef}
              onClick={
                currentSectionIndex === sectionsList.length - 1
                  ? submit
                  : handleNextClick
              }
              variant="contained"
              sx={{ width: "30%" }}
            >
              {currentSectionIndex === sectionsList.length - 1
                ? "submit Exam"
                : "Next Section"}
            </Button>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

export default ExamPage;
