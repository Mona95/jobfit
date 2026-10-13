import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function CoverLetterPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Cover Letter</h1>
            <p className="text-gray-400 text-sm mb-6">
                Cover letters are generated per job for maximum personalization.
            </p>
            <Card>
                <div className="flex flex-col items-center py-8 gap-4">
                    <span className="text-4xl">✉️</span>
                    <div className="text-center">
                        <p className="text-white font-medium">Cover letters live inside each job</p>
                        <p className="text-gray-400 text-sm mt-1 max-w-sm">
                            Open any saved job and go to the Cover Letter tab
                            to generate a personalized letter.
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