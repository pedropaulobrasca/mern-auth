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

import { signInSchema } from '../../../shared/auth.schema'
import { SignInSchema } from '../../../shared/auth.types'

export function SignInPage() {
  const { signIn, error } = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SignInSchema) => {
    try {
      await signIn(data)
      toast.success('Logged in successfully.')
      navigate('/app')
    } catch (error) {
      toast.error('An error occurred while logging in. Please try again.')
      console.error(error)
    }
  }

  return (
    <div className="p-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Please sign in to your account.
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

                  <FormField
                    control={form.control}
                    name="password"
                    disabled={form.formState.isSubmitting}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
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
                      'Sign In'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/auth/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </p>
          <p className="text-sm text-center text-gray-500">
            Forgot your password?{' '}
            <Link to="/auth/forgot-password" className="text-blue-500">
              Reset Password
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
