import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import IntroVideoPage from './pages/IntroVideoPage';
import ModulePage from './pages/ModulePage';
import ToolPage from './pages/ToolPage';
import FinalExamPage from './pages/FinalExamPage';
import ResultsPage from './pages/ResultsPage';
import AccessibilityWidget from './components/AccessibilityWidget';
import ChatSupport from './components/ChatSupport';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/introduction" element={<IntroVideoPage />} />
          <Route path="/module/:sectionId" element={<ModulePage />} />
          <Route path="/tool/:toolId" element={<ToolPage />} />
          <Route path="/final-exam" element={<FinalExamPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>
      </Routes>

      {/* Global floating widgets — positioned to avoid overlap */}
      <AccessibilityWidget />
      <ChatSupport />
    </>
  );
}
