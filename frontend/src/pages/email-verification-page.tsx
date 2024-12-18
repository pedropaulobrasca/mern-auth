import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
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
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useAuthStore } from '@/store/auth.store'

import { verifyEmailSchema } from '../../../shared/auth.schema'
import { VerifyEmailSchema } from '../../../shared/auth.types'

export function EmailVerificationPage() {
  const { verifyEmail, resendVerificationEmail, error, setError } =
    useAuthStore()
  const [isCoolDown, setIsCoolDown] = useState(false)
  const [coolDownTime, setCoolDownTime] = useState(0)
  const [userAlreadyVerified, setUserAlreadyVerified] = useState(false)
  const navigate = useNavigate()

  const form = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verificationToken: '',
    },
  })

  const onSubmit = async (data: VerifyEmailSchema) => {
    try {
      await verifyEmail(data)
      toast.success('Email verified successfully. Please login to continue.')
      navigate('/app')
    } catch (error) {
      toast.error(
        'An error occurred while verifying your email. Please try again.',
      )

      if (
        error instanceof Error &&
        error.message.includes('User already verified')
      ) {
        setUserAlreadyVerified(true)
      }
    }
  }

  const handleResendEmail = async () => {
    try {
      setIsCoolDown(true)
      setCoolDownTime(60)
      await resendVerificationEmail()
      toast.success('Verification email sent successfully.')
    } catch (error) {
      toast.error(
        'An error occurred while resending your email. Please try again.',
      )
      console.error(error)
    }
  }

  useEffect(() => {
    if (coolDownTime > 0) {
      setTimeout(() => setCoolDownTime(coolDownTime - 1), 1000)
    } else {
      setIsCoolDown(false)
    }
  }, [coolDownTime])

  useEffect(() => {
    setError(null)
  }, [setError, location.pathname])

  return (
    <div className="p-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            Please enter the verification token sent to your email.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="verificationToken"
                    disabled={form.formState.isSubmitting}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            disabled={form.formState.isSubmitting}
                            {...field}
                          >
                            <InputOTPGroup className="flex w-full">
                              <InputOTPSlot index={0} className="flex-1" />
                              <InputOTPSlot index={1} className="flex-1" />
                              <InputOTPSlot index={2} className="flex-1" />
                              <InputOTPSlot index={3} className="flex-1" />
                              <InputOTPSlot index={4} className="flex-1" />
                              <InputOTPSlot index={5} className="flex-1" />
                            </InputOTPGroup>
                          </InputOTP>
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
                      'Verify Email'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="w-full">
          <div className="flex flex-col space-y-1.5 w-full">
            <Button
              type="button"
              variant="link"
              disabled={
                form.formState.isSubmitting || isCoolDown || userAlreadyVerified
              }
              onClick={handleResendEmail}
            >
              {form.formState.isSubmitting ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                'Resend Verification Email'
              )}
            </Button>
            {isCoolDown && (
              <p className="text-sm text-center text-gray-500">
                Please wait {coolDownTime} seconds before requesting another
                email.
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
