import { useCartState } from "../context/cart"
import Image from 'next/image'
import Link from "next/link"

export default function CartPage() {
    const { cart, updateQuantity } = useCartState()
    const isEmptyCart = JSON.stringify(cart) === "{}"

    if (isEmptyCart) return <p>Loading...</p>
    const { line_items, subtotal } = cart
    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {line_items.length > 0 ? line_items.map(item => (
                    <li key={item.id}>
                        <div className="mb-4">
                            <Image src={item.media.source} alt={item.name} width={128} height={128} />
                            <p className="font-semibold">{item.product_name}</p>
                            <p>{item.price.formatted_with_code} * {item.quantity} = {item.line_total.formatted_with_code}</p>
                            <div>
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                <button onClick={() => updateQuantity(item.id, 0)}>x</button>
                            </div>
                        </div>
                    </li>
                )) : (
                    <p>Empty cart</p>
                )}
                <p>Sub total: {subtotal.formatted_with_code}</p>
                {line_items.length > 0 && <Link href="/checkout"><a>Check out</a></Link>}
            </ul>
        </div>
    )
}
