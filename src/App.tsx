// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Presurvey from './pages/Presurvey'
import Postsurvey from './pages/Postsurvey'
import Session1 from './pages/Session1'
import Session2 from './pages/Session2'
import ThankYou from './pages/ThankYou'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/presurvey" element={<Presurvey />} />
        <Route path="/postsurvey" element={<Postsurvey />} />
        <Route path="/session1" element={<Session1 />} />
        <Route path="/session2" element={<Session2 />} />
        <Route path="/thankyou" element={<ThankYou />} />
      </Routes>
    </Router>
  )
}

export default App