import React, { ReactNode } from 'react'
import Head from 'next/head'
import Link from 'next/link'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Valist' }: Props) => (

  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" /> 
    </Head>
    <nav className="sticky" id="navbar">
            <Link href="/organizations" className="nav-active">Organizations</Link>
            <Link href="/repo/create">Create a Repo</Link>
    </nav>
    <div id="valist-content-fixed">
      {children}
    </div>
    <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
)

export default Layout
