import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
                                                            label,
                                                            error,
                                                            hint,
                                                            className = '',
                                                            ...props
                                                        }, ref) => {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label className="text-sm font-medium text-gray-300">
                    {label}
                    {props.required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <input
                ref={ref}
                className={`
          w-full px-3 py-2 rounded-lg text-sm
          bg-gray-900 border text-gray-100
          placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-150
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
        </div>
    )
})

Input.displayName = 'Input'
export default Input