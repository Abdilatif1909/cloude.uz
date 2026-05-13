import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
import BooksPage from './pages/BooksPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import HomePage from './pages/HomePage';
import LecturesPage from './pages/LecturesPage';
import LoginPage from './pages/LoginPage';
import PracticalsPage from './pages/PracticalsPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import TeacherTestsPage from './pages/TeacherTestsPage';
import TestResultPage from './pages/TestResultPage';
import TestSessionPage from './pages/TestSessionPage';
import TestsPage from './pages/TestsPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lectures" element={<LecturesPage />} />
        <Route path="/practicals" element={<PracticalsPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route
          path="/tests/session/:testId"
          element={
            <ProtectedRoute>
              <TestSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/result/:resultId"
          element={
            <ProtectedRoute>
              <TestResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/tests"
          element={
            <ProtectedRoute>
              <TeacherTestsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
