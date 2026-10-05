import { useParams, useNavigate } from 'react-router-dom'
import { useCV } from '../hooks/useCVs'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'

export default function CVDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: cv, isLoading, error } = useCV(id!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading CV...</p>
      </div>
    )
  }

  if (error || !cv) {
    return <Alert type="error" message="CV not found or failed to load." />
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/cv')}
        >
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">{cv.title}</h1>
          {cv.label && (
            <p className="text-blue-400 text-sm mt-0.5">{cv.label}</p>
          )}
        </div>
      </div>

      {/* Meta */}
      <Card padding="sm" className="mb-6">
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-500 text-xs">File</p>
            <p className="text-gray-300">{cv.file_name ?? 'No file'}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Uploaded</p>
            <p className="text-gray-300">
              {new Date(cv.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Last updated</p>
            <p className="text-gray-300">
              {new Date(cv.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* CV content */}
      <Card>
        <h2 className="text-white font-semibold mb-4">CV Content</h2>
        <pre className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed font-mono">
          {cv.content}
        </pre>
      </Card>
    </div>
  )
}