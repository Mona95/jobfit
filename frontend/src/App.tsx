import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'

// Pages — we'll build these next
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CVPage from './pages/CVPage'
import AnalyzePage from './pages/AnalyzePage'
import JobsPage from './pages/JobsPage'
import CoverLetterPage from './pages/CoverLetterPage'
import InterviewPrepPage from './pages/InterviewPrepPage'

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated())
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <>{children}</>
}

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/cv" element={
                <ProtectedRoute><CVPage /></ProtectedRoute>
            } />
            <Route path="/analyze" element={
                <ProtectedRoute><AnalyzePage /></ProtectedRoute>
            } />
            <Route path="/jobs" element={
                <ProtectedRoute><JobsPage /></ProtectedRoute>
            } />
            <Route path="/cover-letter" element={
                <ProtectedRoute><CoverLetterPage /></ProtectedRoute>
            } />
            <Route path="/interview-prep" element={
                <ProtectedRoute><InterviewPrepPage /></ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}

export default App