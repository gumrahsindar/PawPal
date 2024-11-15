import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export default function AuthForm() {
  return (
    <form className='mt-6 w-[350px]'>
      <div className='space-y-1'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' />
      </div>
      <div className='my-5'></div>
      <div className='space-y-1'>
        <Label htmlFor='password'>Password</Label>
        <Input id='password' type='password' />
      </div>

      <Button className='mt-6'>Log In</Button>
    </form>
  )
}
