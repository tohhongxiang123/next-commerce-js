import Navbar from "./Navbar";
import Head from 'next/head'

interface LayoutProps {
    title?: string,
    children: React.ReactNode | React.ReactNode[]
}

export default function Layout({ children, title = 'Home' }: LayoutProps) {
    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>
            <Navbar />
            <>
                {children}
            </>
        </div>
    )
}
