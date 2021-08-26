import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { useCartState } from '../context/cart'
import { useOnClickOutside } from '../hooks'
import SidebarCart from './SideBarCart'

export default function Navbar() {
    const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false)
    const mobileNavbarRef = useRef(null)
    useOnClickOutside(mobileNavbarRef, () => setIsMobileNavbarOpen(false))

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownMenuRef = useRef(null)
    useOnClickOutside(dropdownMenuRef, () => setIsDropdownOpen(false))

    const router = useRouter()
    const links = [
        {
            name: 'Products',
            link: '/products'
        },
        {
            name: 'Categories',
            link: '/categories'
        },
        {
            name: 'About',
            link: '/about'
        },
    ].map(link => ({ ...link, isActive: router.asPath.startsWith(link.link) }))

    const { isSidebarCartOpen, toggleSidebarCart } = useCartState()
    return (
        <nav className="bg-gray-800" ref={mobileNavbarRef}>
            {isSidebarCartOpen && <SidebarCart />}
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 z-10">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button onClick={() => setIsMobileNavbarOpen(c => !c)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <Link href="/">
                            <a>
                                <div className="flex-shrink-0 flex items-center">
                                    <img className="block lg:hidden h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow" />
                                    <img className="hidden lg:block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg" alt="Workflow" />
                                </div>
                            </a>
                        </Link>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                {links.map(link => link.isActive ? (
                                    <Link href={link.link} key={link.link}><a className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" aria-current="page">{link.name}</a></Link>
                                ) : (
                                    <Link href={link.link} key={link.link}><a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{link.name}</a></Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button onClick={toggleSidebarCart} type="button" className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">View cart</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                        </button>
                        <div className="ml-3 relative" ref={dropdownMenuRef}>
                            <div>
                                <button onClick={() => setIsDropdownOpen(c => !c)} type="button" className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                </button>
                            </div>
                            {isDropdownOpen && <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-0">Your Profile</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-1">Settings</a>
                                <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="user-menu-item-2">Sign out</a>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            {isMobileNavbarOpen && <div className="sm:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {links.map(link => link.isActive ? (
                        <Link href={link.link} key={link.link}><a className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">{link.name}</a></Link>
                    ) : (
                        <Link href={link.link} key={link.link}><a className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">{link.name}</a></Link>
                    ))}
                </div>
            </div>}
        </nav>
    )
}
