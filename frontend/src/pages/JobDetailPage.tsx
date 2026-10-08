import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useJob, useUpdateJob } from '../hooks/useJobs'
import {
    useJobAnalysis,
    useAnalyzeJob,
    useTailorCV,
    useGenerateCoverLetter,
    useGenerateInterviewPrep
} from '../hooks/useAnalysis'
import { useCVList } from '../hooks/useCVs'
import { useToast } from '../stores/toast'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Alert from '../components/ui/Alert'
import type { JobStatus } from '../types'

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
    { value: 'saved', label: 'Saved' },
    { value: 'applied', label: 'Applied' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejected', label: 'Rejected' },
]

function ScoreRing({ score, label }: { score: number; label: string }) {
    const color = score >= 70 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'
    return (
        <div className="flex flex-col items-center gap-1">
            <span className={`text-3xl font-bold ${color}`}>{score}%</span>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    )
}

export default function JobDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const toast = useToast()
    const [selectedCvId, setSelectedCvId] = useState('')
    const [activeTab, setActiveTab] = useState<'analysis' | 'tailoring' | 'cover-letter' | 'interview'>('analysis')
    const [coverLetterTone, setCoverLetterTone] = useState('professional')

    const { data: job, isLoading: jobLoading } = useJob(id!)
    const { data: cvs } = useCVList()
    const { data: analysis, isLoading: analysisLoading } = useJobAnalysis(id!)

    const analyzeMutation = useAnalyzeJob()
    const tailorMutation = useTailorCV()
    const coverLetterMutation = useGenerateCoverLetter()
    const interviewMutation = useGenerateInterviewPrep()
    const updateMutation = useUpdateJob()

    if (jobLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading job...</p>
            </div>
        )
    }

    if (!job) return <Alert type="error" message="Job not found." />

    const handleAnalyze = () => {
        if (!selectedCvId) return toast.error('Please select a CV first')
        analyzeMutation.mutate(
            { cvId: selectedCvId, jobId: id! },
            {
                onSuccess: () => toast.success('Analysis complete'),
                onError: () => toast.error('Analysis failed — please try again')
            }
        )
    }

    const handleTailor = () => {
        if (!selectedCvId) return toast.error('Please select a CV first')
        tailorMutation.mutate(
            { cvId: selectedCvId, jobId: id! },
            {
                onSuccess: () => toast.success('CV tailoring complete'),
                onError: () => toast.error('Tailoring failed — please try again')
            }
        )
    }

    const handleCoverLetter = () => {
        if (!selectedCvId) return toast.error('Please select a CV first')
        coverLetterMutation.mutate(
            {
                cvId: selectedCvId,
                jobId: id!,
                companyName: job.company,
                roleTitle: job.title,
                tone: coverLetterTone
            },
            {
                onSuccess: () => toast.success('Cover letter generated'),
                onError: () => toast.error('Cover letter failed — please try again')
            }
        )
    }

    const handleInterviewPrep = () => {
        if (!selectedCvId) return toast.error('Please select a CV first')
        interviewMutation.mutate(
            { cvId: selectedCvId, jobId: id! },
            {
                onSuccess: () => toast.success('Interview prep ready'),
                onError: () => toast.error('Interview prep failed — please try again')
            }
        )
    }

    const handleStatusChange = (status: JobStatus) => {
        updateMutation.mutate(
            { id: id!, payload: { status } },
            { onSuccess: () => toast.success('Status updated') }
        )
    }

    const tabs = [
        { id: 'analysis', label: '🔍 Analysis' },
        { id: 'tailoring', label: '✏️ CV Tailoring' },
        { id: 'cover-letter', label: '✉️ Cover Letter' },
        { id: 'interview', label: '🎯 Interview Prep' },
    ] as const

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
                    ← Back
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{job.company}</p>
                </div>
                <select
                    value={job.status}
                    onChange={e => handleStatusChange(e.target.value as JobStatus)}
                    className="text-sm bg-gray-800 border border-gray-700 text-gray-300
            rounded-lg px-3 py-2 focus:outline-none focus:ring-2
            focus:ring-blue-500 cursor-pointer"
                >
                    {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* CV selector */}
            <Card className="mb-6" padding="sm">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-400 shrink-0">Select CV:</p>
                    <select
                        value={selectedCvId}
                        onChange={e => setSelectedCvId(e.target.value)}
                        className="flex-1 text-sm bg-gray-900 border border-gray-700
              text-gray-300 rounded-lg px-3 py-2 focus:outline-none
              focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose a CV...</option>
                        {cvs?.map(cv => (
                            <option key={cv.id} value={cv.id}>
                                {cv.title}{cv.label ? ` — ${cv.label}` : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800
        rounded-xl p-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg
              transition-all duration-150
              ${activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Analysis Tab */}
            {activeTab === 'analysis' && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={handleAnalyze}
                            isLoading={analyzeMutation.isPending}
                        >
                            {analysis?.analysis ? 'Re-analyze' : 'Analyze Match'}
                        </Button>
                    </div>

                    {analysisLoading && (
                        <p className="text-gray-500 text-sm">Loading analysis...</p>
                    )}

                    {analysis?.analysis && (
                        <>
                            {/* Scores */}
                            <Card>
                                <div className="flex justify-around py-2">
                                    <ScoreRing score={analysis.analysis.match_score} label="Match Score" />
                                    <ScoreRing score={analysis.analysis.ats_score} label="ATS Score" />
                                </div>
                                <p className="text-gray-400 text-sm text-center mt-4 border-t border-gray-800 pt-4">
                                    {analysis.analysis.summary}
                                </p>
                            </Card>

                            {/* Keywords */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <h3 className="text-green-400 font-medium text-sm mb-3">
                                        ✓ Matching keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.analysis.matching_keywords.map(kw => (
                                            <span key={kw} className="text-xs px-2 py-1 bg-green-950
                        text-green-300 rounded-full border border-green-800">
                        {kw}
                      </span>
                                        ))}
                                    </div>
                                </Card>
                                <Card>
                                    <h3 className="text-red-400 font-medium text-sm mb-3">
                                        ✕ Missing keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.analysis.missing_keywords.map(kw => (
                                            <span key={kw} className="text-xs px-2 py-1 bg-red-950
                        text-red-300 rounded-full border border-red-800">
                        {kw}
                      </span>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Strengths and gaps */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <h3 className="text-white font-medium text-sm mb-3">Strengths</h3>
                                    <ul className="flex flex-col gap-2">
                                        {analysis.analysis.strengths.map((s, i) => (
                                            <li key={i} className="text-gray-400 text-xs flex gap-2">
                                                <span className="text-green-400 shrink-0">→</span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                                <Card>
                                    <h3 className="text-white font-medium text-sm mb-3">Skill Gaps</h3>
                                    <ul className="flex flex-col gap-2">
                                        {analysis.analysis.skill_gaps.map((g, i) => (
                                            <li key={i} className="text-gray-400 text-xs flex gap-2">
                                                <span className="text-red-400 shrink-0">→</span>
                                                {g}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>

                            {/* Recommendations */}
                            <Card>
                                <h3 className="text-white font-medium text-sm mb-3">
                                    Recommendations
                                </h3>
                                <ul className="flex flex-col gap-2">
                                    {analysis.analysis.recommendations.map((r, i) => (
                                        <li key={i} className="text-gray-400 text-sm flex gap-2">
                                            <span className="text-blue-400 shrink-0">{i + 1}.</span>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </>
                    )}

                    {!analysis?.analysis && !analysisLoading && (
                        <Card>
                            <div className="text-center py-8">
                                <p className="text-gray-400">No analysis yet.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select a CV and click Analyze Match.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* CV Tailoring Tab */}
            {activeTab === 'tailoring' && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={handleTailor}
                            isLoading={tailorMutation.isPending}
                        >
                            {analysis?.tailoring ? 'Re-tailor CV' : 'Tailor CV'}
                        </Button>
                    </div>

                    {analysis?.tailoring ? (
                        <>
                            <Card>
                                <h3 className="text-white font-medium text-sm mb-2">
                                    Overall Advice
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {analysis.tailoring.overall_advice}
                                </p>
                            </Card>

                            {analysis.tailoring.rewritten_sections.map((section, i) => (
                                <Card key={i}>
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Original</p>
                                            <p className="text-gray-400 text-sm bg-gray-950 p-3
                        rounded-lg border border-gray-800">
                                                {section.original}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-green-400 mb-1">Rewritten</p>
                                            <p className="text-gray-200 text-sm bg-green-950 p-3
                        rounded-lg border border-green-800">
                                                {section.rewritten}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Changes made</p>
                                            <p className="text-gray-400 text-xs">{section.changes_made}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </>
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <p className="text-gray-400">No tailoring yet.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select a CV and click Tailor CV.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Cover Letter Tab */}
            {activeTab === 'cover-letter' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-end gap-3">
                        <select
                            value={coverLetterTone}
                            onChange={e => setCoverLetterTone(e.target.value)}
                            className="text-sm bg-gray-800 border border-gray-700 text-gray-300
                rounded-lg px-3 py-2 focus:outline-none focus:ring-2
                focus:ring-blue-500"
                        >
                            <option value="professional">Professional</option>
                            <option value="conversational">Conversational</option>
                            <option value="enthusiastic">Enthusiastic</option>
                            <option value="formal">Formal</option>
                        </select>
                        <Button
                            onClick={handleCoverLetter}
                            isLoading={coverLetterMutation.isPending}
                        >
                            {analysis?.cover_letter ? 'Regenerate' : 'Generate Cover Letter'}
                        </Button>
                    </div>

                    {analysis?.cover_letter ? (
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-medium text-sm">Cover Letter</h3>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            analysis.cover_letter!.cover_letter
                                        )
                                        toast.success('Copied to clipboard')
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                            <pre className="text-gray-300 text-sm whitespace-pre-wrap
                leading-relaxed font-sans">
                {analysis.cover_letter.cover_letter}
              </pre>
                        </Card>
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <p className="text-gray-400">No cover letter yet.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select a CV, choose a tone, and generate.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* Interview Prep Tab */}
            {activeTab === 'interview' && (
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={handleInterviewPrep}
                            isLoading={interviewMutation.isPending}
                        >
                            {analysis?.interview_prep ? 'Regenerate' : 'Generate Interview Prep'}
                        </Button>
                    </div>

                    {analysis?.interview_prep ? (
                        <>
                            {analysis.interview_prep.preparation_tips.length > 0 && (
                                <Card>
                                    <h3 className="text-white font-medium text-sm mb-3">
                                        Preparation Tips
                                    </h3>
                                    <ul className="flex flex-col gap-2">
                                        {analysis.interview_prep.preparation_tips.map((tip, i) => (
                                            <li key={i} className="text-gray-400 text-sm flex gap-2">
                                                <span className="text-blue-400 shrink-0">→</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            )}

                            {analysis.interview_prep.questions.map((q, i) => (
                                <Card key={i}>
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-white font-medium text-sm">{q.question}</h3>
                                        <div className="flex gap-2 shrink-0">
                      <span className="text-xs px-2 py-0.5 bg-gray-800
                        text-gray-400 rounded-full capitalize">
                        {q.category}
                      </span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize
                        ${q.difficulty === 'hard'
                                                ? 'bg-red-950 text-red-400'
                                                : q.difficulty === 'medium'
                                                    ? 'bg-amber-950 text-amber-400'
                                                    : 'bg-green-950 text-green-400'
                                            }`}>
                        {q.difficulty}
                      </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-950 rounded-lg p-3 border border-gray-800">
                                        <p className="text-xs text-gray-500 mb-1">Suggested answer</p>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {q.suggested_answer}
                                        </p>
                                    </div>
                                    {q.key_points.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs text-gray-500 mb-2">Key points to hit</p>
                                            <div className="flex flex-wrap gap-2">
                                                {q.key_points.map((point, j) => (
                                                    <span key={j} className="text-xs px-2 py-1
                            bg-blue-950 text-blue-300 rounded-full
                            border border-blue-800">
                            {point}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </>
                    ) : (
                        <Card>
                            <div className="text-center py-8">
                                <p className="text-gray-400">No interview prep yet.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select a CV and generate interview questions.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    )
}