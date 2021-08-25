import { Cart } from '@chec/commerce.js/types/cart'
import { Product } from '@chec/commerce.js/types/product'
import { loadStripe } from '@stripe/stripe-js'
import { createContext, useContext, useEffect, useState } from 'react'
import commerce from '../lib/commerce'

export const CartStateContext = createContext<{
    cart: Cart,
    addToCart: (productId: Product['id'], quantity?: number, variantData?: Object) => void,
    updateQuantity: (productId: Product['id'], updatdQuantity: number) => void,
    refreshCart: () => void
}>(null as any)

export const useCartState = () => useContext(CartStateContext)

export const CartProvider = ({ children }: any) => {
    const [cart, setCart] = useState<Cart>({} as any)

    const getCart = async () => {
        try {
            setCart(await commerce.cart.retrieve())
        } catch (err) {
            console.log(err) // display toast
        }
    }

    const addToCart = async (productId: Product['id'], quantity = 1, variantData = {}) => {
        await commerce.cart.add(productId, quantity, variantData)
            .then(({ cart }) => setCart(oldCart => ({ ...oldCart, ...cart })))
            .catch(err => console.log(err)) // display toast
    }

    const updateQuantity = async (productId: Product['id'], updatedQuantity: number) => {
        await commerce.cart.update(productId, { quantity: updatedQuantity })
            .then(({ cart }) => setCart(oldCart => ({ ...oldCart, ...cart })))
            .catch(err => console.log(err))
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh()
        setCart(newCart)
    }

    useEffect(() => {
        getCart()
    }, [])

    return (
        <CartStateContext.Provider value={{ cart, addToCart, updateQuantity, refreshCart }}>
            {children}
        </CartStateContext.Provider>
    )
}