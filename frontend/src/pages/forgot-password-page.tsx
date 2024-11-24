import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth.store'

import { forgotPasswordSchema } from '../../../shared/auth.schema'
import { ForgotPasswordSchema } from '../../../shared/auth.types'
import { useEffect } from 'react'

export function ForgotPasswordPage() {
  const { forgotPassword, error, setError } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await forgotPassword(data)
      toast.success('Password reset email sent successfully.')
      navigate('/auth/sign-in')
    } catch (error) {
      toast.error('An error occurred. Please try again.')
      console.error(error)
    }
  }

  useEffect(() => {
    setError(null)
  }, [setError, location.pathname])

  return (
    <div className="p-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    disabled={form.formState.isSubmitting}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="johndoe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <FormMessage className="text-red-500">{error}</FormMessage>
                  )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <Loader className="animate-spin mx-auto" size={24} />
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center text-gray-500">
            Remembered your password?{' '}
            <Link to="/auth/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
