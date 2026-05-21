import { Josefin_Sans} from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

const josefin = Josefin_Sans({
  variable: "--font-geist-sans",
});


export const metadata = {
  title: "Study Nook || Your Own Room",
  description: "Explore your Room",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${josefin.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar/>
        {children}
        <Footer/>
        <Toaster />
        </body>
    </html>
  );
}