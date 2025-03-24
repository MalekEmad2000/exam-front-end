/*
This Redux state to contain credentials of the student
State to contain an object 
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
  credential: [],
  exam_id: '-100',
}

const credentialSlice = createSlice({
  name: 'student-credentials',
  initialState: initialState,
  reducers: {
    insertCredentials(state, action) {
      state.credential.push(action.payload)

      // cn make meutable code
    },
    insertExamId(state, action) {
      state.exam_id = action.payload
    },
    getToken(state, action) {
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

export default credentialSlice.reducer
export const credentialActions = credentialSlice.actions
