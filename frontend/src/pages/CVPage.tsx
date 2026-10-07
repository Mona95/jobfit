import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useCVList, useCVStats, useUploadCV, useDeleteCV } from '../hooks/useCVs'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import ConfirmModal from '../components/ui/ConfirmModal'
import { useToast } from '../stores/toast'
import { CVCardSkeleton, StatCardSkeleton } from '../components/ui/Skeleton'

interface UploadFormData {
    title: string
    label: string
    file: FileList
}

function UploadForm({ onClose }: { onClose: () => void }) {
    const uploadMutation = useUploadCV()
    const { register, handleSubmit, formState: { errors } } = useForm<UploadFormData>()
    const toast = useToast()

    const onSubmit = (data: UploadFormData) => {
        uploadMutation.mutate(
            { title: data.title, label: data.label || null, file: data.file[0] },
            {
                onSuccess: () => {
                    toast.success('CV uploaded successfully')
                    onClose()
                },
                onError: () => {
                    toast.error('Failed to upload CV')
                }
            }
        )
    }

    return (
        <Card className="mb-6">
            <h3 className="text-white font-semibold mb-4">Upload new CV</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {uploadMutation.isError && (
                    <Alert type="error" message="Failed to upload CV. Make sure it's a valid PDF." />
                )}
                <Input
                    label="Title"
                    placeholder="e.g. Senior Dev CV"
                    required
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                />
                <Input
                    label="Label (optional)"
                    placeholder="e.g. Fintech roles, AI Engineering"
                    {...register('label')}
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">
                        PDF File <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".pdf"
                        className="text-sm text-gray-400 file:mr-3 file:py-1.5 file:px-3
              file:rounded-lg file:border-0 file:text-sm file:font-medium
              file:bg-blue-600 file:text-white hover:file:bg-blue-700
              file:cursor-pointer cursor-pointer"
                        {...register('file', { required: 'Please select a PDF file' })}
                    />
                    {errors.file && <p className="text-xs text-red-400">{errors.file.message}</p>}
                </div>
                <div className="flex gap-3 mt-2">
                    <Button type="submit" isLoading={uploadMutation.isPending}>
                        Upload CV
                    </Button>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    )
}

function CVStatsSection() {
    const { data: stats, isLoading } = useCVStats()

    if (isLoading) return (
        <div className="mb-8">
            <h2 className="text-white font-semibold mb-3">CV Performance</h2>
            <div className="flex flex-col gap-3">
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        </div>
    )
    if (!stats?.length) return null

    return (
        <div className="mb-8">
            <h2 className="text-white font-semibold mb-3">CV Performance</h2>
            <div className="grid grid-cols-1 gap-3">
                {stats.map(stat => (
                    <Card key={stat.cv_id} padding="sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium text-sm">{stat.title}</p>
                                {stat.label && (
                                    <p className="text-blue-400 text-xs mt-0.5">{stat.label}</p>
                                )}
                            </div>
                            <div className="flex gap-6 text-right">
                                <div>
                                    <p className="text-xs text-gray-500">Applications</p>
                                    <p className="text-white font-semibold">{stat.total_applications}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Avg Match</p>
                                    <p className="text-white font-semibold">{stat.avg_match_score}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Best Match</p>
                                    <p className="text-green-400 font-semibold">{stat.best_match_score}%</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function CVPage() {
    const [showUpload, setShowUpload] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
    const { data: cvs, isLoading, error } = useCVList()
    const deleteMutation = useDeleteCV()
    const toast = useToast()

    const handleDelete = (id: string, title: string) => {
        setDeleteTarget({ id, title })
    }

    const confirmDelete = () => {
        if (!deleteTarget) return
        deleteMutation.mutate(deleteTarget.id,{
            onSuccess: () => {
            setDeleteTarget(null)
            toast.success(`"${deleteTarget.title}" deleted`)
        },
            onError: () => {
            toast.error('Failed to delete CV')
        }
    })
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">My CVs</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage your CV versions and track performance
                    </p>
                </div>
                <Button onClick={() => setShowUpload(!showUpload)}>
                    {showUpload ? 'Cancel' : '+ Upload CV'}
                </Button>
            </div>

            {/* Upload form */}
            {showUpload && <UploadForm onClose={() => setShowUpload(false)} />}

            {/* Stats */}
            <CVStatsSection />

            {/* CV list */}
            <h2 className="text-white font-semibold mb-3">All CVs</h2>

            {isLoading && (
                <div className="flex flex-col gap-3">
                    <CVCardSkeleton />
                    <CVCardSkeleton />
                    <CVCardSkeleton />
                </div>
            )}

            {error && (
                <Alert type="error" message="Failed to load CVs. Please refresh." />
            )}

            {cvs?.length === 0 && (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-400">No CVs uploaded yet.</p>
                        <p className="text-gray-500 text-sm mt-1">
                            Upload your first CV to get started.
                        </p>
                    </div>
                </Card>
            )}

            <div className="flex flex-col gap-3">
                {cvs?.map(cv => (
                    <Card key={cv.id} padding="sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">{cv.title}</p>
                                {cv.label && (
                                    <p className="text-blue-400 text-xs mt-0.5">{cv.label}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">
                                    {cv.file_name} · {new Date(cv.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link to={`/cv/${cv.id}`}>
                                    <Button variant="secondary" size="sm">View</Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(cv.id, cv.title)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete CV"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This will permanently delete all analysis results, cover letters and interview prep linked to this CV. This cannot be undone.`}                confirmLabel="Delete CV"
                isLoading={deleteMutation.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}