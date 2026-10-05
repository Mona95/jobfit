import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import { useLogin } from '../hooks/useAuth'

interface LoginFormData {
    email: string
    password: string
}

export default function LoginPage() {
    const loginMutation = useLogin()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>()

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data)
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your JobFit account"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {loginMutation.isError && (
                    <Alert
                        type="error"
                        message="Invalid email or password. Please try again."
                    />
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    error={errors.email?.message}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address'
                        }
                    })}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Your password"
                    required
                    error={errors.password?.message}
                    {...register('password', {
                        required: 'Password is required'
                    })}
                />

                <Button
                    type="submit"
                    isLoading={loginMutation.isPending}
                    className="w-full mt-2"
                >
                    Sign in
                </Button>

                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300">
                        Create one
                    </Link>
                </p>

            </form>
        </AuthLayout>
    )
}