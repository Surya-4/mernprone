import React from 'react'
import Header from './componenets/Header'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <main>
    <Header/>
    <Outlet/>
    </main>
  )
}
