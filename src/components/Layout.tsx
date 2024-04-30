import Navbar from "./Navbar";
import Sidebar from './Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
    return ( 
        <>
            <div className="wrapper">
                <Navbar />
                <Sidebar />
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}