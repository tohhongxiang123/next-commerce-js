import Navbar from "./Navbar";

interface LayoutProps {
    title?: string,
    children: React.ReactNode | React.ReactNode[]
}

export default function Layout({ children, title = '' }: LayoutProps) {
    return (
        <div>
            <Navbar />
            <>
                {children}
            </>
        </div>
    )
}
