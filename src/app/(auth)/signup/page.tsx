import AuthForm from '@/components/auth-form'
import H1 from '@/components/h1'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main>
      <H1 className='text-center'>Sign Up</H1>

      <AuthForm type='signUp' />

      <p className='mt-6'>
        Already have an account?{' '}
        <Link href='/login' className='ml-1 text-sm text-zinc-500 font-bold'>
          Log in
        </Link>
      </p>
    </main>
  )
}
