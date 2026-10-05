interface AlertProps {
    type: 'error' | 'success' | 'info'
    message: string
}

const styles = {
    error: 'bg-red-950 border-red-800 text-red-300',
    success: 'bg-green-950 border-green-800 text-green-300',
    info: 'bg-blue-950 border-blue-800 text-blue-300'
}

const icons = {
    error: '✕',
    success: '✓',
    info: 'ℹ'
}

export default function Alert({ type, message }: AlertProps) {
    return (
        <div className={`
      flex items-start gap-3 px-4 py-3 rounded-lg border text-sm
      ${styles[type]}
    `}>
            <span className="font-bold shrink-0">{icons[type]}</span>
            <span>{message}</span>
        </div>
    )
}