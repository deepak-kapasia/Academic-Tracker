import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SubjectTracker from './components/SubjectTracker';
import DailyLog from './components/DailyLog';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:user" element={<Dashboard />}>
          <Route index element={<Navigate to="subjects" replace />} />
          <Route path="subjects" element={<SubjectTracker />} />
          <Route path="dailylog" element={<DailyLog />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
