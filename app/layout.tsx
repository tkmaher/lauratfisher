import type { Metadata } from "next";
import { userAgent } from 'next/server';
import "./globals.scss";
import localFont from 'next/font/local';
import { Header, NavBar} from "../src/components/menu";

export const metadata: Metadata = {
  title: "Laura T. Fisher | Actress",
  description: "The website of actress Laura T. Fisher.",
};

const poppins = localFont({
  src: [
    {
      path: '../public/Poppins/Poppins-Regular.ttf',  
      weight: '400',
      style: 'normal',
    },

    {
      path: '../public/Poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'bold',
    },
    {
      path: '../public/Poppins/Poppins-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ]

});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header/>
        <div className="column">
          <NavBar/>
          <div className="column-body">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
