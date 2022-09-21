import { SessionProvider } from "next-auth/react"
import "./styles.css"
import { Session } from "next-auth"
import type { AppProps } from "next/app"
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from "@mui/x-date-pickers"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
<Component {...pageProps} />
      </LocalizationProvider>
      
    </SessionProvider>
  )
}
