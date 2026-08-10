import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import TopicPage from './pages/TopicPage.jsx';
import LevelPage from './pages/LevelPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App({ logoSrc }) {
  return (
    <Layout logoSrc={logoSrc}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/topic/:categoryId/:topicId" element={<TopicPage />} />
        <Route
          path="/topic/:categoryId/:topicId/:level"
          element={<LevelPage />}
        />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/flashcards/:categoryId" element={<FlashcardsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/:categoryId" element={<QuizPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  );
}
