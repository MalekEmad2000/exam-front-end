/*
This Redux state to contain answers of the student
State to contain an array of objects containing answers
in the following format
{
      question_id: question.question_id,
      choice_id: selectedoption,
}
and a counter.
#########################################


*/

import { PURGE } from 'redux-persist'

import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  answers: [],
  answersCounter: 0,
}

const answerSlice = createSlice({
  name: 'student-answers',
  initialState: initialState,
  reducers: {
    addAnswer(state, action) {
      // console.log(action.payload);
      //   const indexOfCurrentAnswer = state.answers.findIndex((element) => {
      //     return element.question_id === action.payload.question_id;
      //   });

      //   if (indexOfCurrentAnswer) {
      //     state.answers[indexOfCurrentAnswer].choice_id =
      //       action.payload.choice_id;
      //   }

      if (Number.isInteger(action.payload.choice_id)) {
        const indexOfCurrentAnswer = state.answers.findIndex((element) => {
          return element.question_id === action.payload.question_id  &&element.section_id === action.payload.section_id;
        })

        if (indexOfCurrentAnswer >= 0) {
          state.answers[indexOfCurrentAnswer].choice_id =
            action.payload.choice_id
        } else {
          state.answers.push(action.payload)
          state.answersCounter++
        }
      }
    },
    getAnswer(state, action) {
      const answer = state.answers.find(
        (element) => element.question_id === action.payload
      )

      if (Number.isInteger(answer.choice_id)) {
        return answer.choice_id
      } else {
        return null
      }
    },
    isDuplicateAnswer(state, action) {
      state.counter = state.counter + action.payload
      // can recive payloads as well
    },
    extraReducers: (builder) => {
      builder.addCase(PURGE, () => {
        return initialState
      })
    },
  },
})

export default answerSlice.reducer
export const answerActions = answerSlice.actions
