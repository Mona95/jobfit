import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useJobList, useCreateJob, useUpdateJob, useDeleteJob } from '../hooks/useJobs'
import { useToast } from '../stores/toast'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import ConfirmModal from '../components/ui/ConfirmModal'
import type { JobStatus } from '../types'

const STATUS_OPTIONS: { value: JobStatus; label: string; color: string }[] = [
    { value: 'saved', label: 'Saved', color: 'text-gray-400 bg-gray-800' },
    { value: 'applied', label: 'Applied', color: 'text-blue-400 bg-blue-950' },
    { value: 'interview', label: 'Interview', color: 'text-amber-400 bg-amber-950' },
    { value: 'offer', label: 'Offer', color: 'text-green-400 bg-green-950' },
    { value: 'rejected', label: 'Rejected', color: 'text-red-400 bg-red-950' },
]

interface JobFormData {
    title: string
    company: string
    description: string
    url: string
    notes: string
}

function StatusBadge({ status }: { status: JobStatus }) {
    const option = STATUS_OPTIONS.find(s => s.value === status)
    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${option?.color}`}>
      {option?.label}
    </span>
    )
}

function AddJobForm({ onClose }: { onClose: () => void }) {
    const createMutation = useCreateJob()
    const toast = useToast()
    const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>()

    const onSubmit = (data: JobFormData) => {
        createMutation.mutate(
            {
                title: data.title,
                company: data.company,
                description: data.description,
                url: data.url || undefined,
                notes: data.notes || undefined
            },
            {
                onSuccess: () => {
                    toast.success('Job saved successfully')
                    onClose()
                },
                onError: () => toast.error('Failed to save job')
            }
        )
    }

    return (
        <Card className="mb-6">
            <h3 className="text-white font-semibold mb-4">Add new job</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {createMutation.isError && (
                    <Alert type="error" message="Failed to save job. Please try again." />
                )}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Job title"
                        placeholder="e.g. Senior Frontend Engineer"
                        required
                        error={errors.title?.message}
                        {...register('title', { required: 'Title is required' })}
                    />
                    <Input
                        label="Company"
                        placeholder="e.g. FinByte"
                        required
                        error={errors.company?.message}
                        {...register('company', { required: 'Company is required' })}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-300">
                        Job description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        rows={6}
                        placeholder="Paste the full job description here..."
                        className="w-full px-3 py-2 rounded-lg text-sm bg-gray-900 border
              border-gray-700 text-gray-100 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent resize-none"
                        {...register('description', { required: 'Description is required' })}
                    />
                    {errors.description && (
                        <p className="text-xs text-red-400">{errors.description.message}</p>
                    )}
                </div>
                <Input
                    label="Job URL (optional)"
                    placeholder="https://linkedin.com/jobs/..."
                    {...register('url')}
                />
                <Input
                    label="Notes (optional)"
                    placeholder="e.g. Spoke to recruiter on Monday"
                    {...register('notes')}
                />
                <div className="flex gap-3 mt-2">
                    <Button type="submit" isLoading={createMutation.isPending}>
                        Save job
                    </Button>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default function JobsPage() {
    const [showForm, setShowForm] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
    const [statusFilter, setStatusFilter] = useState<JobStatus | undefined>(undefined)
    const { data: jobs, isLoading, error } = useJobList(statusFilter)
    const updateMutation = useUpdateJob()
    const deleteMutation = useDeleteJob()
    const toast = useToast()

    const handleStatusChange = (jobId: string, status: JobStatus) => {
        updateMutation.mutate(
            { id: jobId, payload: { status } },
            {
                onSuccess: () => toast.success('Status updated'),
                onError: () => toast.error('Failed to update status')
            }
        )
    }

    const confirmDelete = () => {
        if (!deleteTarget) return
        deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
                toast.success(`"${deleteTarget.title}" deleted`)
                setDeleteTarget(null)
            },
            onError: () => toast.error('Failed to delete job')
        })
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Job Tracker</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Track your applications and manage your pipeline
                    </p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Add Job'}
                </Button>
            </div>

            {/* Add job form */}
            {showForm && <AddJobForm onClose={() => setShowForm(false)} />}

            {/* Status filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setStatusFilter(undefined)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all
            ${!statusFilter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    All
                </button>
                {STATUS_OPTIONS.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all
              ${statusFilter === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Job list */}
            {isLoading && <p className="text-gray-500 text-sm">Loading jobs...</p>}
            {error && <Alert type="error" message="Failed to load jobs." />}
            {jobs?.length === 0 && (
                <Card>
                    <div className="text-center py-8">
                        <p className="text-gray-400">No jobs saved yet.</p>
                        <p className="text-gray-500 text-sm mt-1">
                            Add your first job to start tracking applications.
                        </p>
                    </div>
                </Card>
            )}

            <div className="flex flex-col gap-3">
                {jobs?.map(job => (
                    <Card key={job.id} padding="sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <p className="text-white font-medium truncate">{job.title}</p>
                                    <StatusBadge status={job.status} />
                                </div>
                                <p className="text-gray-400 text-sm">{job.company}</p>
                                {job.url && (
                                    <a
                                        href={job.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 text-xs hover:underline mt-1 block"
                                    >
                                        View posting →
                                    </a>
                                )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                {/* Status dropdown */}
                                <select
                                    value={job.status}
                                    onChange={e => handleStatusChange(job.id, e.target.value as JobStatus)}
                                    className="text-xs bg-gray-800 border border-gray-700 text-gray-300
                    rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1
                    focus:ring-blue-500 cursor-pointer"
                                >
                                    {STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>

                                <Link to={`/jobs/${job.id}`}>
                                    <Button variant="secondary" size="sm">View</Button>
                                </Link>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => setDeleteTarget({ id: job.id, title: job.title })}
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
                title="Delete Job"
                message={`Are you sure you want to delete "${deleteTarget?.title}" at ${deleteTarget?.title}? All analysis results for this job will also be deleted.`}
                confirmLabel="Delete Job"
                isLoading={deleteMutation.isPending}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    )
}