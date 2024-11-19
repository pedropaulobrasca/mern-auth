import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"

import { VerifyEmailSchema } from "../../../shared/auth.types"
import { verifyEmailSchema } from "../../../shared/auth.schema"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export function EmailVerificationPage() {
  const { verifyEmail, resendVerificationEmail, error } = useAuthStore()
  const [isCoolDown, setIsCoolDown] = useState(false)
  const [coolDownTime, setCoolDownTime] = useState(0)
  const [userAlreadyVerified, setUserAlreadyVerified] = useState(false)
  const navigate = useNavigate()

  const form = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verificationToken: "",
    }
  })

  const onSubmit = async (data: VerifyEmailSchema) => {
    try {
      await verifyEmail(data)
      toast.success("Email verified successfully. Please login to continue.")
      navigate("/auth/sign-in")
    } catch (error) {
      toast.error("An error occurred while verifying your email. Please try again.")
      console.error(error)

      if (error instanceof Error && error.message.includes("User already verified")) {
        setUserAlreadyVerified(true)
      }
    }
  }

  const handleResendEmail = async () => {
    try {
      setIsCoolDown(true)
      setCoolDownTime(60)
      await resendVerificationEmail()
      toast.success("Verification email sent successfully.")
    } catch (error) {
      toast.error("An error occurred while resending your email. Please try again.")
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

  return <div className="p-8">
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>
          Verify Your Email
        </CardTitle>
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
                      <FormLabel>Verification Token</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <FormMessage className="text-red-500">{error}</FormMessage>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader className="animate-spin mx-auto" size={24} /> : "Verify Email"}
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
            disabled={form.formState.isSubmitting || isCoolDown || userAlreadyVerified}
            onClick={handleResendEmail}
          >
            {form.formState.isSubmitting ? <Loader className="animate-spin mx-auto" size={24} /> : "Resend Verification Email"}
          </Button>
          {isCoolDown && (
            <p className="text-sm text-center text-gray-500">
              Please wait {coolDownTime} seconds before requesting another email.
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  </div>
}