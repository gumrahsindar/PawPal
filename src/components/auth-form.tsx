"use client"

import { logIn, signUp } from "@/actions/actions"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import AuthFormBtn from "./auth-form-btn"
import { useActionState } from "react"

type AuthFormProps = {
  type: "logIn" | "signUp"
}
export default function AuthForm({ type }: AuthFormProps) {
  const [signUpError, dispatchSignUp] = useActionState(signUp, undefined)
  const [logInError, dispatchLogIn] = useActionState(logIn, undefined)
  return (
    <form
      action={type === "logIn" ? dispatchLogIn : dispatchSignUp}
      className="mt-6 w-[350px]"
    >
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required maxLength={100} />
      </div>
      <div className="my-5"></div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          maxLength={100}
        />
      </div>

      <AuthFormBtn type={type} />

      {signUpError && (
        <div className="text-red-500 mt-2">{signUpError.message}</div>
      )}

      {logInError && (
        <div className="text-red-500 mt-2">{logInError.message}</div>
      )}
    </form>
  )
}
