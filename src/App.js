import HomePage from './pages/Home'
import JoinPage from './pages/Join'
import ExamPage from './pages/Exam'
import EndPage from './pages/End'
import WaitingPage from './pages/Waiting'
import QuestionList from './componants/QuestionList'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/join', element: <JoinPage /> },
  { path: '/exam', element: <ExamPage /> },
  { path: '/end', element: <EndPage /> },
  { path: '/wait', element: <WaitingPage /> },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
