interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Job<span className="text-blue-500">Fit</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">AI-powered CV tailoring</p>
                </div>

                {/* Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        {subtitle && (
                            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
                        )}
                    </div>
                    {children}
                </div>

            </div>
        </div>
    )
}