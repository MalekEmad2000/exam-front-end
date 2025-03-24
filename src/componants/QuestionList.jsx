import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  styled,
} from "@mui/material";

import CircleIcon from "@mui/icons-material/Circle";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { answerActions } from "../store/student-answers";
import { flushSync } from "react-dom";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ChoiceButton = styled(Button)({
  color: "#666",
  justifyContent: "flex-start",
  marginBottom: "9px",
  marginBottom: "9px",
  cursor: "pointer",

  border: "1px solid #bbb",
  borderColor: "#eaeaea",
  borderRadius: "2px",
  minWidth: "25px",
});

function QuestionList({
  sectionList,
  setCurrentSectionIndex,
  answering,
  returnToAnswering,
}) {
  const answers = useSelector((state) => state.answers.answers);
  const bookmarks = useSelector((state) => state.bookmark.bookmarks);

  return (
    <>
      {sectionList.map((section, index1) => {
        // let section_order=section[]

        let section_id=section.section_order
        let section_id_json=section.section_id

        return (
          <Card
            sx={{
              justifyContent: "center",
              width: "100%",
              borderStyle: "none",
              boxShadow: "none",
              paddingBottom: "10px",
              marginBottom: "10px",
            }}
          >
            <CardHeader title={section.section_title} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
              }}
              alignItems="center"
            >
              {section.questions.map((question, index) => {
                let isAnswered = false;
                let isBookamrked = false;

                const answer = answers.filter(
                  (element) => element.question_id === question.question_id && element.section_id===section_id_json
                );
                if (answer.length > 0) {
                  isAnswered = true;
                } else {
                  isAnswered = false;
                }

                const bookmark = bookmarks.filter(
                  (element) => element.question_id === question.question_id && element.section_id===section_id_json
                );
                if (bookmark.length > 0) {
                  isBookamrked = true;
                } else {
                  isBookamrked = false;
                }

                return (
                  <ChoiceButton
                    onClick={() => {
                      flushSync(() => {
                        if (isBookamrked) {
                          // console.log(bookmark[0].question_id)
                          setCurrentSectionIndex(
                            section_id,
                            bookmark[0].question_id
                          );
                        } else if (isAnswered) {
                          setCurrentSectionIndex(
                            section_id,
                            answer[0].question_id
                          );
                        } else {
                          setCurrentSectionIndex(index1,question.question_id);
                        }
                      });
                    }}
                    sx={
                      isBookamrked === true
                        ? "background-color:#20ad18"
                        : isAnswered === true
                        ? "background-color:#36aafd"
                        : null
                    }
                    key={question.question_id}
                  >
                    {index + 1}
                  </ChoiceButton>
                );
              })}
            </Box>

            <Box
              sx={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  flexWrap: "nowrap",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <CircleIcon sx={{ fontSize: "15px" }} color="primary" />

                <Typography
                  sx={{ marginLeft: "5px" }}
                  variant="body2"
                  gutterBottom
                >
                  Answered
                </Typography>
              </Box>

              <Box
                sx={{
                  flexWrap: "nowrap",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <CircleIcon sx={{ fontSize: "15px", color: "#20ad18" }} />
                <Typography
                  sx={{ marginLeft: "5px" }}
                  variant="body2"
                  gutterBottom
                >
                  Bookmarked
                </Typography>
              </Box>
            </Box>

            {/* <ButtonGroup
                    orientation="vertical"
                    aria-label="vertical outlined button group"
                  >
                    {buttons}
                  </ButtonGroup> */}
          </Card>
        );
      })}
    </>
  );
}

export default QuestionList;
