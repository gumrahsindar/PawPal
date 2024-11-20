import AuthForm from '@/components/auth-form'
import H1 from '@/components/h1'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main>
      <H1 className='text-center'>Log In</H1>

      <AuthForm type='logIn' />

      <p className='mt-6'>
        No account yet?{' '}
        <Link href='/signup' className='ml-1 text-sm text-zinc-500 font-bold'>
          Sign up
        </Link>
      </p>
    </main>
  )
}
