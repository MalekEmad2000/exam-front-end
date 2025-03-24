import { configureStore } from '@reduxjs/toolkit'
import studentAnswersReducer from './student-answers'
import studentCredentialsReducer from './student-credentials'
import bookmarksReducer from './bookmarks'
import { combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  answers: studentAnswersReducer,
  cred: studentCredentialsReducer,
  bookmark: bookmarksReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

// const store = configureStore({
//   reducer: { answers: studentAnswersReducer, cred: studentCredentialsReducer },
// });

export default store
export const purgePersistedData = () => {
  persistor.purge()
}
export const persistor = persistStore(store)
