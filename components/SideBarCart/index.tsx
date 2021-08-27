import { CART_STATES, useCartState } from "../../context/cart"
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from "react"
import { useOnClickOutside } from '../../hooks'
import CartItem from "./CartItem"

export default function SidebarCart() {
    const { cart: { line_items, subtotal, hosted_checkout_url }, refreshCart, cartStatus, toggleSidebarCart } = useCartState()
    const ref = useRef(null)
    useOnClickOutside(ref, () => toggleSidebarCart())
    return (
        <div ref={ref} className={`fixed right-0 top-0 bg-gray-50 z-20 h-full w-full flex flex-col sm:w-1/2 lg:w-1/3`}>
            {line_items ? (
                <>
                    <div className="flex justify-between bg-gray-100 py-8 px-4">
                        <h1 className="text-2xl opacity-75">Cart Summary</h1>
                        <button className="px-8 py-2" onClick={toggleSidebarCart}>X</button>
                    </div>
                    <ul className="overflow-auto">
                        {(line_items && line_items.length > 0) ? line_items.map(item => (
                            <li key={item.id} className="flex p-4 gap-x-4">
                                <CartItem item={item} />
                            </li>
                        )) : (
                            <li className="font-medium text-center my-8 opacity-75 text-lg"><i>No items in cart</i></li>
                        )}
                    </ul>
                    <div className="p-4 border-t-2 border-gray-300 mx-4">
                        <p className="font-semibold text-center">Subtotal: <span className="text-2xl">{subtotal.formatted_with_code}</span></p>
                        <a href={hosted_checkout_url} className={`block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4 mb-2 ${cartStatus.status === CART_STATES.LOADING ? 'pointer-events-none opacity-50' : ''}`}>
                            {cartStatus.status === CART_STATES.LOADING ? cartStatus.message : "Checkout"}
                        </a>
                        <div className="flex justify-between">
                            <Link href={'/cart'}><a className="text-md opacity-75 hover:underline">View detailed cart</a></Link>
                            {line_items.length > 0 && <button className="text-md opacity-75 hover:underline" onClick={refreshCart} disabled={cartStatus.status === CART_STATES.LOADING}>Clear cart</button>}
                        </div>
                    </div>
                </>
            ) : <p className="font-medium text-center opacity-75 text-lg">{cartStatus.message}</p>}
        </div>
    )
}