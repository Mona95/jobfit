import Button from './Button'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    isLoading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
                                         isOpen,
                                         title,
                                         message,
                                         confirmLabel = 'Delete',
                                         isLoading = false,
                                         onConfirm,
                                         onCancel
                                     }: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        // Backdrop
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50
        flex items-center justify-center p-4"
            onClick={onCancel}
        >
            {/* Modal */}
            <div
                className="bg-gray-900 border border-gray-700 rounded-2xl
          p-6 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-red-950 border border-red-800
          flex items-center justify-center mb-4">
                    <span className="text-red-400 text-xl">⚠</span>
                </div>

                {/* Content */}
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{message}</p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        isLoading={isLoading}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}