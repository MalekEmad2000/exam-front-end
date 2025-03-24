import { Build } from '@mui/icons-material'
import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

const initialState = {
  bookmarks: [],
  bookmarksCounter: 0,
}

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: initialState,
  reducers: {
    addBookmark(state, action) {
      if (Number.isInteger(action.payload.question_id)) {
        const indexOfCurrentBookmark = state.bookmarks.findIndex((element) => {
          return element.question_id === action.payload.question_id && element.section_id === action.payload.section_id;
        })

        if (indexOfCurrentBookmark >= 0) {
          state.bookmarks.splice(indexOfCurrentBookmark, 1)
        } else {
          state.bookmarks.push(action.payload)
          state.bookmarksCounter++
        }
      }
    },
    extraReducers: (builder) => {
      builder.addCase(PURGE, () => {
        return initialState
      })
    },
  },
})

export default bookmarkSlice.reducer
export const bookmarkActions = bookmarkSlice.actions
