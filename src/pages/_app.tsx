import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Lato, Playfair_Display } from 'next/font/google'

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] })
const playfairDisplay = Playfair_Display({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div>
            <style jsx global>{`
                h1, h2, h3, h4, h4, h5, h6 {
                  font-family: ${lato.style.fontFamily};
                }
            `}</style>
            <Component {...pageProps} />
        </div>
    )
}
