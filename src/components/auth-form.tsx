import { logIn, signUp } from '@/actions/actions'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

type AuthFormProps = {
  type: 'logIn' | 'signUp'
}
export default function AuthForm({ type }: AuthFormProps) {
  return (
    <form action={type === 'logIn' ? logIn : signUp} className='mt-6 w-[350px]'>
      <div className='space-y-1'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' name='email' type='email' />
      </div>
      <div className='my-5'></div>
      <div className='space-y-1'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' name='password' type='password' />
      </div>

      <Button className='mt-6'>
        {type === 'logIn' ? 'Log In' : 'Sign Up'}
      </Button>
    </form>
  )
}
