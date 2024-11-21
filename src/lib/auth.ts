import NextAuth, { NextAuthConfig } from 'next-auth'
import prisma from './db'
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'

const config = {
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // runs on login
        const { email, password } = credentials

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        })
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

      if (!isTryingToAccessApp) {
        return true
      }
    },
  },
} satisfies NextAuthConfig

export const { auth, signIn, signOut } = NextAuth(config)
