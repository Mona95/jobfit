import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: 'sm' | 'md' | 'lg'
}

const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
}

export default function Card({
                                 padding = 'md',
                                 className = '',
                                 children,
                                 ...props
                             }: CardProps) {
    return (
        <div
            className={`
        bg-gray-900 border border-gray-800 rounded-xl
        ${paddings[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    )
}