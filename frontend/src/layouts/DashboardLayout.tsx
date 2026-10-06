import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { ToastContainer } from '../components/ui/Toast'
import { useToastStore } from '../stores/toast'

interface NavItem {
    label: string
    path: string
    icon: string
}

const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
    { label: 'My CVs', path: '/cv', icon: '📄' },
    { label: 'Analyze', path: '/analyze', icon: '🔍' },
    { label: 'Jobs', path: '/jobs', icon: '💼' },
    { label: 'Cover Letter', path: '/cover-letter', icon: '✉️' },
    { label: 'Interview Prep', path: '/interview-prep', icon: '🎯' },
]

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const { toasts, removeToast } = useToastStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">

            {/* Sidebar */}
            <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">

                {/* Brand */}
                <div className="px-6 py-5 border-b border-gray-800">
                    <h1 className="text-xl font-bold text-white">
                        Job<span className="text-blue-500">Fit</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">AI CV Tailoring</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150
                  ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }
                `}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* User section */}
                <div className="px-3 py-4 border-t border-gray-800">
                    <div className="px-3 py-2 mb-1">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm text-gray-300 truncate">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800
              transition-all duration-150"
                    >
                        <span>→</span>
                        Sign out
                    </button>
                </div>

            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-8 py-8">
                    {children}
                </div>
            </main>

            <ToastContainer
                toasts={toasts}
                onRemove={removeToast}
            />

        </div>
    )
}