import { LoginForm } from '../components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
      <LoginForm />
    </div>
  )
}