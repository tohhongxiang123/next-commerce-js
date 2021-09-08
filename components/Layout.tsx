import Navbar from "./Navbar";
import Head from 'next/head'

interface LayoutProps {
    title?: string,
    children: React.ReactNode | React.ReactNode[]
}

export default function Layout({ children, title = 'Home' }: LayoutProps) {
    return (
        <div className="h-screen flex flex-col">
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex-shrink-0">
                <Navbar />
            </div>
            <div className="flex-grow h-full overflow-auto">
                {children}
            </div>
        </div>
    )
}
