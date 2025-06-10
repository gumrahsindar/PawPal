import NextAuth, { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { NextResponse } from "next/server"
import { getUserByEmail } from "./server-utils"
import { authSchema } from "./validations"

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // validation
        const validatedFormData = authSchema.safeParse(credentials)
        if (!validatedFormData.success) {
          return null
        }

        // extract values
        const { email, password } = validatedFormData.data

        const user = await getUserByEmail(email)
        if (!user) {
          console.log("User not found")
          return null
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        )

        if (!passwordsMatch) {
          console.log("Invalid credentials")
          return null
        }

        return user
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = !!auth?.user
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app")
      const isAuthPage =
        request.nextUrl.pathname.includes("/login") ||
        request.nextUrl.pathname.includes("/signup")
      const isRootPath = request.nextUrl.pathname === "/"

      // Root path için özel kontrol
      if (isRootPath && isLoggedIn && auth.user.hasAccess) {
        return NextResponse.redirect(new URL("/app/dashboard", request.nextUrl))
      }

      if (isRootPath && isLoggedIn && !auth.user.hasAccess) {
        return NextResponse.redirect(new URL("/payment", request.nextUrl))
      }

      // App sayfalarına erişim kontrolü
      if (!isLoggedIn && isTryingToAccessApp) {
        return NextResponse.redirect(new URL("/login", request.nextUrl))
      }

      if (isLoggedIn && isTryingToAccessApp && !auth.user.hasAccess) {
        return NextResponse.redirect(new URL("/payment", request.nextUrl))
      }

      if (isLoggedIn && isTryingToAccessApp && auth.user.hasAccess) {
        return true
      }

      // Auth sayfalarına erişim kontrolü
      if (isLoggedIn && isAuthPage && auth.user.hasAccess) {
        return NextResponse.redirect(new URL("/app/dashboard", request.nextUrl))
      }

      if (isLoggedIn && isAuthPage && !auth.user.hasAccess) {
        return NextResponse.redirect(new URL("/payment", request.nextUrl))
      }

      return true
    },

    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.hasAccess = user.hasAccess
      }
      if (trigger === "update") {
        const userFromDb = await getUserByEmail(token.email!)
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess
        }
      }

      return token
    },
    session: ({ session, token }) => {
      session.user.id = token.userId as string
      session.user.hasAccess = token.hasAccess as boolean

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
