import NextAuth, { NextAuthConfig } from 'next-auth'
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'
import { NextResponse } from 'next/server'
import { getUserByEmail } from './server-utils'
import { authSchema, TAuth } from './validations'

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login

        // validation

        const validatedFormData = authSchema.safeParse(credentials)
        if (!validatedFormData.success) {
          return null
        }

        // extract values
        const { email, password } = validatedFormData.data

        const user = await getUserByEmail(email)
        if (!user) {
          console.log('User not found')
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        )

        if (!passwordsMatch) {
          console.log('Invalid credentials')
          return null
        }

        return user
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = !!auth?.user
      const isTryingToAccessApp = request.nextUrl.pathname.includes('/app')

      if (!isLoggedIn && isTryingToAccessApp) {
        return false
      }

      if (isLoggedIn && isTryingToAccessApp) {
        return true
      }

      if (isLoggedIn && !isTryingToAccessApp) {
        return NextResponse.redirect(
          new URL('/app/dashboard', request.nextUrl.origin)
        )
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true
      }

      return false
    },

    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id
      }

      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId as string
      }

      return session
    },
  },
} satisfies NextAuthConfig

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config)
