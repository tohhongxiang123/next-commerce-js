import { CART_STATES, useCartState } from "../context/cart"
import Link from 'next/link'

export default function SidebarCart() {
    const { cart: { line_items, subtotal, hosted_checkout_url }, refreshCart, cartStatus, toggleSidebarCart, updateQuantity } = useCartState()
    return (
        <div className={`fixed right-0 top-0 bg-gray-50 z-20 h-full w-full flex flex-col sm:w-1/2 lg:w-1/3`}>
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
                                <div>
                                    <Link href={`/products/${(item as any).permalink}`}><a><h2 className="text-lg font-semibold opacity-75 hover:underline">{item.name}</h2></a></Link>
                                    {(item as any).selected_options && <p>{(item as any).selected_options.map((option: any) => option.option_name).join(', ')}</p>}
                                    <p>Quantity: {item.quantity}</p>
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button onClick={() => updateQuantity(item.id, 0)}>x</button>
                                    <p>{item.line_total.formatted_with_code}</p>
                                </div>
                            </li>
                        )) : (
                            <li className="font-medium text-center my-8 opacity-75 text-lg"><i>No items in cart</i></li>
                        )}
                    </ul>
                    <div className="p-4 border-t-2 border-gray-300 mx-4">
                        {line_items.length > 0 && <button onClick={refreshCart} disabled={cartStatus.status === CART_STATES.LOADING}>{cartStatus.status === CART_STATES.LOADING ? cartStatus.message : 'Clear cart'}</button>}
                        <p>Subtotal: {subtotal.formatted_with_code}</p>
                        <p><a href={hosted_checkout_url}>Checkout</a></p>
                        <p><Link href={'/cart'}><a>View detailed cart</a></Link></p>
                    </div>
                </>
            ) : <p className="font-medium text-center opacity-75 text-lg">{cartStatus.message}</p>}
        </div>
    )
}