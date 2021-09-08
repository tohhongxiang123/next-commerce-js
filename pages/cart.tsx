import { CART_STATES, useCartState } from "../context/cart"
import Link from "next/link"
import { CartItem, Layout } from "../components"

export default function CartPage() {
    const { cart, refreshCart, cartStatus } = useCartState()
    const isEmptyCart = JSON.stringify(cart) === "{}"

    if (isEmptyCart) return <p>Loading...</p>

    const { line_items, subtotal, hosted_checkout_url } = cart
    return (
        <Layout title="Cart">
            <h1 className="text-3xl font-semibold text-center m-4 opacity-80">Cart</h1>
            <ul className="max-w-xl mx-auto">
                {line_items.length > 0 ? line_items.map(item => (
                    <li key={item.id}>
                        <CartItem item={item} />
                    </li>
                )) : (
                    <p className="text-center text-lg opacity-60 mb-4 font-medium"><i>No items in cart...</i></p>
                )}
                <div className="p-4 border-t-2 border-gray-300 mx-4">
                    <p className="font-semibold text-center">Subtotal: <span className="text-2xl">{subtotal.formatted_with_code}</span></p>
                    <a href={hosted_checkout_url} className={`block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4 mb-2 ${cartStatus.status === CART_STATES.LOADING ? 'pointer-events-none opacity-50' : ''}`}>
                        {cartStatus.status === CART_STATES.LOADING ? cartStatus.message : "Checkout"}
                    </a>
                    <div className="flex justify-center">
                        {line_items.length > 0 && <button className="text-md opacity-75 hover:underline" onClick={refreshCart} disabled={cartStatus.status === CART_STATES.LOADING}>Clear cart</button>}
                    </div>
                </div>
            </ul>
        </Layout>
    )
}
