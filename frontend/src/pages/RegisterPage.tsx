import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input.tsx'
import Alert from '../components/ui/Alert'
import { useRegister } from '../hooks/useAuth'

interface RegisterFormData {
    email: string
    password: string
    confirmPassword: string
}

export default function RegisterPage() {
    const registerMutation = useRegister()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>()

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate({
            email: data.email,
            password: data.password
        })
    }

    return (
        <AuthLayout
            title="Create account"
            subtitle="Start tailoring your CV with AI"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {registerMutation.isError && (
                    <Alert
                        type="error"
                        message="This email is already registered. Try logging in instead."
                    />
                )}

                {registerMutation.isSuccess && (
                    <Alert
                        type="success"
                        message="Account created! Redirecting to login..."
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
                    placeholder="Min. 8 characters"
                    required
                    error={errors.password?.message}
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters'
                        }
                    })}
                />

                <Input
                    label="Confirm password"
                    type="password"
                    placeholder="Repeat your password"
                    required
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                            value === watch('password') || 'Passwords do not match'
                    })}
                />

                <Button
                    type="submit"
                    isLoading={registerMutation.isPending}
                    className="w-full mt-2"
                >
                    Create account
                </Button>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300">
                        Sign in
                    </Link>
                </p>

            </form>
        </AuthLayout>
    )
}