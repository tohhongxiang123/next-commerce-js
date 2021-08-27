import { CART_STATES, useCartState } from "../context/cart"
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from "react"
import { useOnClickOutside } from '../hooks'

export default function SidebarCart() {
    const { cart: { line_items, subtotal, hosted_checkout_url }, refreshCart, cartStatus, toggleSidebarCart, updateQuantity } = useCartState()
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
                                <Link href={`/products/${(item as any).permalink}`}>
                                    <a className="block relative h-36 w-36 rounded overflow-hidden">
                                        <img className="object-cover object-center w-full h-full block" src={item.media.source ? item.media.source : '/no_image_placeholder.svg'} alt={item.name} />
                                    </a>
                                </Link>
                                <div className="w-full">
                                    <Link href={`/products/${(item as any).permalink}`}><a><h2 className="text-lg font-semibold hover:underline">{item.name}</h2></a></Link>
                                    {(item as any).selected_options && <p className="font-medium opacity-75">{(item as any).selected_options.map((option: any) => option.option_name).join(', ')}</p>}
                                    <div className="flex items-center justify-between w-full opacity-75">
                                        <div className="flex items-center my-2 rounded-lg border-2 border-gray-200">
                                            <button className="opacity-50 hover:opacity-100 hover:bg-gray-100 text-lg py-2 px-4 border-r border-gray-200 mr-4 h-12 w-12 font-bold flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <p className="text-lg font-semibold">{item.quantity}</p>
                                            <button className="opacity-75 hover:opacity-100 hover:bg-gray-100 text-lg py-2 px-4 border-l border-gray-200 ml-4 h-12 w-12 font-bold flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button onClick={() => updateQuantity(item.id, 0)} className="opacity-50 hover:opacity-75"><Image src={"/delete.svg"} alt="Delete item" width={32} height={32} /></button>
                                    </div>
                                    <p className="font-bold text-lg">{item.line_total.formatted_with_code}</p>
                                </div>
                            </li>
                        )) : (
                            <li className="font-medium text-center my-8 opacity-75 text-lg"><i>No items in cart</i></li>
                        )}
                    </ul>
                    <div className="p-4 border-t-2 border-gray-300 mx-4">
                        <p className="font-semibold text-center">Subtotal: <span className="text-2xl">{subtotal.formatted_with_code}</span></p>
                        <a href={hosted_checkout_url} className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4 mb-2">Checkout</a>
                        <div className="flex justify-between">
                            <Link href={'/cart'}><a className="text-md opacity-75 hover:underline">View detailed cart</a></Link>
                            {line_items.length > 0 && <button className="text-md opacity-75 hover:underline" onClick={refreshCart} disabled={cartStatus.status === CART_STATES.LOADING}>{cartStatus.status === CART_STATES.LOADING ? cartStatus.message : 'Clear cart'}</button>}
                        </div>
                    </div>
                </>
            ) : <p className="font-medium text-center opacity-75 text-lg">{cartStatus.message}</p>}
        </div>
    )
}