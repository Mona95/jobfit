import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function InterviewPrepPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Interview Prep</h1>
            <p className="text-gray-400 text-sm mb-6">
                Interview questions are generated based on specific job descriptions.
            </p>
            <Card>
                <div className="flex flex-col items-center py-8 gap-4">
                    <span className="text-4xl">🎯</span>
                    <div className="text-center">
                        <p className="text-white font-medium">Interview prep lives inside each job</p>
                        <p className="text-gray-400 text-sm mt-1 max-w-sm">
                            Open any saved job and go to the Interview Prep tab
                            to generate tailored questions and answers.
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