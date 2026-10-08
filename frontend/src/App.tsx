import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import DashboardLayout from './layouts/DashboardLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CVPage from './pages/CVPage'
import AnalyzePage from './pages/AnalyzePage'
import JobsPage from './pages/JobsPage'
import CoverLetterPage from './pages/CoverLetterPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import CVDetailPage from './pages/CVDetailPage.tsx'
import JobDetailPage from "./pages/JobDetailPage.tsx";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated())
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return <DashboardLayout>{children}</DashboardLayout>
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

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

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

            <Route path="/cv/:id" element={
                <ProtectedRoute><CVDetailPage /></ProtectedRoute>
            } />

            <Route path="/jobs/:id" element={
                <ProtectedRoute><JobDetailPage /></ProtectedRoute>
            } />
        </Routes>
    )
}

export default App