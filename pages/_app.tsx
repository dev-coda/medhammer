import { SessionProvider } from "next-auth/react"
import "./styles.css"
import { Session } from "next-auth"
import type { AppProps } from "next/app"
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from 'dayjs';

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps<{session: Session}>) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
<Component {...pageProps} />
      </LocalizationProvider>
      
    </SessionProvider>
  )
}
