import { Link } from 'react-router-dom'
import { useCVList } from '../hooks/useCVs'
import { useAuthStore } from '../stores/auth'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { DashboardStatSkeleton } from '../components/ui/Skeleton'

interface QuickAction {
    title: string
    description: string
    path: string
    icon: string
}

const quickActions: QuickAction[] = [
    {
        title: 'Upload CV',
        description: 'Add a new CV version to your library',
        path: '/cv',
        icon: '📄'
    },
    {
        title: 'Analyze a Job',
        description: 'Check how well your CV matches a job',
        path: '/analyze',
        icon: '🔍'
    },
    {
        title: 'Track Applications',
        description: 'Manage your job application pipeline',
        path: '/jobs',
        icon: '💼'
    },
    {
        title: 'Generate Cover Letter',
        description: 'Write a personalized cover letter',
        path: '/cover-letter',
        icon: '✉️'
    }
]

export default function DashboardPage() {
    const user = useAuthStore(state => state.user)
    const { data: cvs, isLoading } = useCVList()

    return (
        <div>
            {/* Welcome header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Here's an overview of your job search activity.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {isLoading ? (
                    <>
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                        <DashboardStatSkeleton />
                    </>
                ) : (
                    <>
                        <Card padding="sm">
                            <p className="text-gray-500 text-xs mb-1">CVs uploaded</p>
                            <p className="text-2xl font-bold text-white">{cvs?.length ?? 0}</p>
                        </Card>
                        <Card padding="sm">
                            <p className="text-gray-500 text-xs mb-1">Jobs tracked</p>
                            <p className="text-2xl font-bold text-white">—</p>
                        </Card>
                        <Card padding="sm">
                            <p className="text-gray-500 text-xs mb-1">Analyses run</p>
                            <p className="text-2xl font-bold text-white">—</p>
                        </Card>
                    </>
                )}
            </div>

            {/* CV status */}
            {!isLoading && cvs?.length === 0 && (
                <Card className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">No CV uploaded yet</p>
                            <p className="text-gray-400 text-sm mt-1">
                                Upload your CV to start analyzing job matches.
                            </p>
                        </div>
                        <Link to="/cv">
                            <Button>Upload CV</Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Quick actions */}
            <h2 className="text-white font-semibold mb-3">Quick actions</h2>
            <div className="grid grid-cols-2 gap-4">
                {quickActions.map(action => (
                    <Link key={action.path} to={action.path}>
                        <Card className="hover:border-gray-600 transition-colors cursor-pointer h-full">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{action.icon}</span>
                                <div>
                                    <p className="text-white font-medium text-sm">{action.title}</p>
                                    <p className="text-gray-400 text-xs mt-1">{action.description}</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}