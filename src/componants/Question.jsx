import {
  Card,
  CardHeader,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
  styled,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import IconButton from "@mui/material/IconButton";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { answerActions } from "../store/student-answers";
import { forwardRef } from "react";

import { bookmarkActions } from "../store/bookmarks";
import SubmitErrorModal from "./SubmitErrorModal";

import { useSearchParams, useNavigate, Navigate } from "react-router-dom";

import { flushSync } from "react-dom";

import { SocketHandler } from "../handleSocket";

const socket_handler = SocketHandler.getInstance();
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const BASE_URL = "http://" + window.location.host.split(":")[0] + ":3031/api/";
const ChoiceButton = styled(Button)({
  backgroundColor: "#fff",
  color: "#000000",
  justifyContent: "flex-start",
  marginBottom: "5px",
  border: "2px solid #bbb",
  borderColor: "#eaeaea",
  borderRadius: "4px",
  width: "95%",
  touchAction: "none",
  "@media (hover: none)": {
    "&:hover": {
      border: "2px solid #bbb",
      borderColor: "#eaeaea",
     
    },
  },
});

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

const Question = forwardRef(
  ({ question, currentQuestion, currentSection, isBookmarked }, ref) => {
    const [selectedoption, setSelectedoption] = useState(null);
    const dispatch = useDispatch();
    const answers = useSelector((state) => state.answers.answers);
    const bookmarks = useSelector((state) => state.bookmark.bookmarks);
    const [bookmarked, setIsBookmarked] = useState(false);
    const student_id = useSelector((state) => state.cred);

    const forceUpdate = useForceUpdate();

    const [base64, setBase64] = useState(null);

    // console.log(currentQuestion)

    // console.log(bookmarked);
    const [isErrorSubmitModalOpen, setIsErrorSubmitModalOpen] = useState(false);
    const openSubmitErrorModal = () => {
      setIsErrorSubmitModalOpen(true);
    };

    const closeSubmitErrorModal = () => {
      setIsErrorSubmitModalOpen(false);
      // //delete local storage action
      // navigate("/join", { replace: true });
    };
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const errorSubmitHandler = () => {
      setIsErrorSubmitModalOpen(false);
      console.log("LLLLLL");

      navigate("/join", { replace: true });
    };

    useEffect(() => {
      const bookmark = bookmarks.filter(
        (element) =>
          element.question_id === question.question_id &&
          element.section_id === currentSection
      );
      if (bookmark.length > 0) {
        setIsBookmarked(true);
      } else {
        setIsBookmarked(false);
      }
    });

    useEffect(() => {
      //
      dispatch(
        answerActions.addAnswer({
          question_id: question.question_id,
          choice_id: selectedoption,
          section_id: currentSection,
        })
      );
    }, [selectedoption]);

    function submitQuestion(choice_id) {
      fetch(BASE_URL + "student/submit_answers", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          answers: [
            {
              question_id: question.question_id,
              choice_id: choice_id,
              section_id: currentSection,
            },
          ],
        }),
      })
        .then((response) => {
          console.log(response.statusText);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
        })
        .catch((error) => {
          socket_handler.diconnectSocket();
          console.log(error);
          setError("Failed to Submit Choice Not Connected to Server");
          openSubmitErrorModal();
          // setIsErrorSubmitModalOpen(true);
          // console.error(error);
          // show errorModal
        });
    }

    useEffect(() => {
      const answer = answers.filter(
        (element) =>
          element.question_id === question.question_id &&
          element.section_id === currentSection
      );
      // console.log(answer[0]);
      if (answer.length > 0) {
        // console.log(answer[0].choice_id);
        setSelectedoption(answer[0].choice_id);
        // console.log(selectedoption);
      }

      forceUpdate();
    }, []);

    useEffect(() => {
      const fetchImage = async () => {
        try {
          console.log("fetching image");
          console.log(question.question_id);
          console.log(currentSection);

          const response = await fetch(BASE_URL + "student/question_image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              question_id: question.question_id,
              section_id: currentSection,
            }),
          });
          console.log(response);
          const data = await response.json();

          if (data.image) {
            setBase64(data.image);
          }
        } catch (error) {
          console.log(error);
        }
      };
      if (question.has_diagram && base64 === null) {
        fetchImage();
      }
    });

    useEffect(() => {
      const answer = answers.filter(
        (element) =>
          element.question_id === question.question_id &&
          element.section_id === currentSection
      );
      // console.log(answers);

      if (answer.length > 0) {
        setSelectedoption(answer[0].choice_id);
      } else {
        setSelectedoption(null);
        // console.log(answer);
      }

      // const answer = answerActions.getAnswer(question.question_id);

      // if (answer) {
      //   setSelectedoption(answer);
      // } else {
      //   setSelectedoption(null);
      // }
    }, [currentSection]);

    useEffect(() => {
      if (question.student_choice) {
        setSelectedoption(question.student_choice);
        dispatch(
          answerActions.addAnswer({
            question_id: question.question_id,
            choice_id: question.student_choice,
            section_id: currentSection,
          })
        );
        question.student_choice = null;
      }
    });

    const buttons = [];
    question.question_choices.map((option, index) => {
      buttons.push(
        <ChoiceButton
          disableElevation
          disableRipple
          sx={
            selectedoption === option.choice_id
              ? {
                  border: "4px solid #009aff",
                  marginTop: "25px",
                  marginBottom: "25px",
                  color: "white",
                  backgroundColor: "#009aff",

                  padding: "15px 20px",
                  touchAction: "none", // changed to touch-action: none
                  willChange: "opacity", // added will-change: transform
                  userSelect: "none", // added user-select: none
                  pointerEvents: "none", // add pointerEvents to disable all pointer events

                  // "&:hover": {
                  //   backgroundColor: "#fff",
                  //   border: "10px solid #009aff",
                  //   padding: "15px 20px",
                  // },
                }
              : {
                  touchAction: "none", // changed to touch-action: none
                  willChange: "opacity", // added will-change: transform
                  userSelect: "none", // added user-select: none
                }
          }
          onFocus={(event) => {
            event.preventDefault();
            event.target.blur(); // add this line to remove focus
          }}
        
          onClick={(event) => {
            flushSync(() => {
              event.preventDefault();
              setSelectedoption(null);


              setSelectedoption(option.choice_id);
              submitQuestion(option.choice_id);
              // console.log(option.choice_id);
              // dispatch(
              //   answerActions.addAnswer({
              //     question_id: question.question_id,
              //     choice_id: selectedoption,
              //   })
              // );
            });
          }}
          variant={
            selectedoption === option.choice_id ? "contained" : "outlined"
          }
          key={option.choice_id}
        >
          {" "}
          {String.fromCharCode("A".charCodeAt(0) + index) +
            ". " +
            option.choice_text}
        </ChoiceButton>
      );
    });
    return (
      <Card
        ref={ref}
        sx={
          bookmarked
            ? {
                justifyContent: "center",
                width: "100%",
                borderStyle: "none",
                boxShadow: "none",
                border: "3px solid #009aff",
                padding: "10px 15px",
                marginBottom: "5px",
                boxSizing: "border-box",
              }
            : {
                justifyContent: "center",
                width: "100%",
                borderStyle: "none",
                boxShadow: "none",
              }
        }
      >
        <SubmitErrorModal
          errorMsg={error}
          isOpen={isErrorSubmitModalOpen}
          onClose={closeSubmitErrorModal}
          errorHandler={errorSubmitHandler}
        />
        <CardHeader
          title={currentQuestion + ". " + question.question_text}
          subheader={"( " + question.weight + " Points )"}
        />

        <Box
          sx={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {base64 ? (
            <CardMedia
              component="img"
              sx={{
                width: "75%",
                justifyContent: "center",
                alignItems: "center",
              }}
              image={`data:image/jpeg;base64,${base64}`}
              alt="Paella dish"
            />
          ) : null}
        </Box>
        {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
          }}
          alignItems="center"
        >
          {buttons}
        </Box>

        <CardActions disableSpacing>
          <IconButton aria-label="Bookmark">
            {bookmarked ? (
              <BookmarkIcon
                onClick={() => {
                  dispatch(
                    bookmarkActions.addBookmark({
                      question_id: question.question_id,
                      section_id: currentSection,
                    })
                  );
                  setIsBookmarked((prevCheck) => !prevCheck);
                }}
              />
            ) : (
              <BookmarkBorderIcon
                onClick={() => {
                  dispatch(
                    bookmarkActions.addBookmark({
                      question_id: question.question_id,
                      section_id: currentSection,
                    })
                  );
                  setIsBookmarked((prevCheck) => !prevCheck);
                }}
              />
            )}
          </IconButton>
        </CardActions>
      </Card>
    );
  }
);

export default Question;
