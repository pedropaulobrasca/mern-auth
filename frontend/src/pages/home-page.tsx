import { Activity, Loader2, LogOut, User } from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'

export function HomePage() {
  const { user, signOut } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!user) {
    // TODO: Redirect to login page
    // return <Navigate to="/auth/sign-in" />
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
      console.error(error)
    } finally {
      navigate('/auth/sign-in')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User />
            Profile Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">
            <p>
              Name: <span className="text-muted-foreground">{user?.name}</span>
            </p>
            <p>
              Email:{' '}
              <span className="text-muted-foreground">{user?.email}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity />
            Account Activity
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-2">
            <p>
              Account created:{' '}
              <span className="text-muted-foreground">
                {moment(user?.createdAt).fromNow()}
              </span>
            </p>
            <p>
              Last login:{' '}
              <span className="text-muted-foreground">
                {moment(user?.updatedAt).fromNow()}
              </span>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={handleSignOut} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!loading && <LogOut className="mr-2 h-4 w-4" />}
            {loading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
