import { signIn } from "next-auth/react"

export default function AccessDenied() {
  return (
    <>
      <h1>No estás autorizado</h1>
      <p>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          Debes iniciar sesión para ver esta página
        </a>
      </p>
    </>
  )
}
