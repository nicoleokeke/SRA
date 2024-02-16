import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout';
import HomePage from './pages/home';
import StudentPage from './pages/students';
import CoursePage from './pages/courses';
import ResultPage from './pages/result';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/student', element: <StudentPage /> },
      { path: '/course', element: <CoursePage /> },
      { path: '/result', element: <ResultPage /> },
    ],
  },
]);

export default router;
