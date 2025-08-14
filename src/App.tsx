import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Presurvey from './pages/Presurvey'
import Postsurvey from './pages/Postsurvey'
import Session1 from './pages/Session1'
import Session2 from './pages/Session2'
import ThankYou from './pages/ThankYou'
import SessionLoading from './pages/SessionLoading'
import OnboardingLoading from './pages/OnboardingLoading'
import Session1EndLoading from './pages/Session1EndLoding'
import Session2EndLoading from './pages/Session2EndLoading'
import PostSurveyLoading from './pages/PostSurveyLoading'

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
          <Route path="/session-loading" element={<SessionLoading />} />
          <Route path="/onboarding-loading" element={<OnboardingLoading />} />
          <Route path="/session1-loading" element={<Session1EndLoading />} />
          <Route path="/session2-loading" element={<Session2EndLoading />} />
          <Route path="/postsurvey-loading" element={<PostSurveyLoading />} />
        </Routes>
    </Router>
  )
}

export default App