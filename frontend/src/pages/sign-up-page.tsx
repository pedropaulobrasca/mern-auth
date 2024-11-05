import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"

import { SignUpSchema } from "../../../shared/auth.types"
import { signUpSchema } from "../../../shared/auth.schema"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SignUpPage() {
  const {signup, error} = useAuthStore()
  const navigate = useNavigate()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: ""
    }
  })

  const onSubmit = async (data: SignUpSchema) => {
    try {
      await signup(data)
      toast.success("Account created successfully. Please verify your email to continue.")
      navigate("/auth/verify-email")
    } catch (error) {
      toast.error("An error occurred while creating your account. Please try again.")
      console.error(error)
    }
  }

  return <div className="p-8">
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>
          Join Us Today
        </CardTitle>
        <CardDescription>
          Create your account and start your jouney with us.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="name"
                  disabled={form.formState.isSubmitting}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  disabled={form.formState.isSubmitting}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="johndoe@example.com" {...field} />
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
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm"
                  disabled={form.formState.isSubmitting}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <FormMessage className="text-red-500">{error}</FormMessage>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-sm text-center text-gray-500">
          Already have an account? <Link to="/auth/sing-in" className="text-blue-500">Sign In</Link>
        </p>

        <p className="text-sm text-center text-gray-500">
          By signing up, you agree to our <Link to="#" className="text-blue-500">Terms of Service</Link> and <Link to="#" className="text-blue-500">Privacy Policy</Link>
        </p>
      </CardFooter>
    </Card>
  </div>
}