import Head from 'next/head'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export default function Layout({ title, children }) {
    return (
        <div>
            <NavBar />
            <Head>
                <title>{title ? title + " | " : ""} Insight Journal </title>
            </Head>
            {children}
            <Footer />
        </div>
    )
}