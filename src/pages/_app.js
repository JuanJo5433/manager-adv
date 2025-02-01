import Sidebar from "@/components/sidebar/Sidebar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Sidebar />
            <Component {...pageProps} />
        </>
    );
}
