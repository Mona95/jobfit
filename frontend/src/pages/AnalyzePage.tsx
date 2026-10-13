import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function AnalyzePage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Analyze a Job</h1>
            <p className="text-gray-400 text-sm mb-6">
                Analysis is done per job application for more accurate results.
            </p>
            <Card>
                <div className="flex flex-col items-center py-8 gap-4">
                    <span className="text-4xl">🔍</span>
                    <div className="text-center">
                        <p className="text-white font-medium">Analysis lives inside each job</p>
                        <p className="text-gray-400 text-sm mt-1 max-w-sm">
                            Save a job first, then open it to run CV analysis,
                            get match scores and ATS feedback.
                        </p>
                    </div>
                    <Link to="/jobs">
                        <Button>Go to Job Tracker →</Button>
                    </Link>
                </div>
            </Card>
        </div>
    )
}