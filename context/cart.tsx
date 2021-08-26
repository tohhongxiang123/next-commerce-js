import { Cart } from '@chec/commerce.js/types/cart'
import { Product } from '@chec/commerce.js/types/product'
import { createContext, useContext, useEffect, useState } from 'react'
import commerce from '../lib/commerce'

export const CART_STATES = {
    LOADING: 'LOADING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    IDLE: 'IDLE'
} as const

const TIME_TO_DISPLAY_MESSAGE = 2000

export const CartStateContext = createContext<{
    cart: Cart,
    cartStatus: { status: typeof CART_STATES[keyof typeof CART_STATES], message: string },
    addToCart: (productId: Product['id'], quantity?: number, variantData?: Object) => void,
    updateQuantity: (productId: Product['id'], updatdQuantity: number) => void,
    refreshCart: () => void
}>(null as any)

export const useCartState = () => useContext(CartStateContext)

export const CartProvider = ({ children }: any) => {
    const [cart, setCart] = useState<Cart>({} as any)
    const [cartStatus, setCartStatus] = useState<{ status: typeof CART_STATES[keyof typeof CART_STATES], message: string }>({ status: CART_STATES.IDLE, message: '' })

    const getCart = async () => {
        try {
            setCartStatus(c => ({ message: 'Loading cart...', status: CART_STATES.LOADING }))
            setCart(await commerce.cart.retrieve())
            setCartStatus(c => ({ message: '', status: CART_STATES.IDLE }))
        } catch (err) {
            setCartStatus(c => ({ message: `Failed to retrieve cart: ${err.message}`, status: CART_STATES.ERROR }))
        }
    }

    const addToCart = async (productId: Product['id'], quantity = 1, variantData = {}) => {
        setCartStatus(c => ({ message: 'Adding to cart...', status: CART_STATES.LOADING }))
        await commerce.cart.add(productId, quantity, variantData)
            .then(({ cart }) => {
                setCart(oldCart => ({ ...oldCart, ...cart }))
                setCartStatus(c => ({ message: 'Added product to cart!', status: CART_STATES.SUCCESS }))
            })
            .catch(err => setCartStatus(c => ({ message: `Failed to add to cart: ${err.message}`, status: CART_STATES.ERROR }))) // display toast
    }

    const updateQuantity = async (productId: Product['id'], updatedQuantity: number) => {
        setCartStatus(c => ({ message: 'Updating product...', status: CART_STATES.LOADING }))
        await commerce.cart.update(productId, { quantity: updatedQuantity })
            .then(({ cart }) => {
                setCart(oldCart => ({ ...oldCart, ...cart }))
                setCartStatus(c => ({ message: 'Updated quantity in cart', status: CART_STATES.SUCCESS }))
            })
            .catch(err => setCartStatus(c => ({ message: `Failed to add to cart: ${err.message}`, status: CART_STATES.ERROR })))
    }

    const refreshCart = async () => {
        setCartStatus(c => ({ message: 'Clearing cart...', status: CART_STATES.LOADING }))
        const newCart = await commerce.cart.refresh()
        setCart(newCart)
        setCartStatus(c => ({ message: 'Cleared cart', status: CART_STATES.SUCCESS }))
    }

    useEffect(() => {
        getCart()
    }, [])

    useEffect(() => {
        let timeoutHandler : NodeJS.Timeout | undefined
        if (cartStatus.status === CART_STATES.SUCCESS) {
            timeoutHandler = setTimeout(() => {
                setCartStatus({ message: '', status: CART_STATES.IDLE })
            }, TIME_TO_DISPLAY_MESSAGE)
        }

        return () => timeoutHandler && clearTimeout(timeoutHandler)
    }, [cartStatus.status])

    return (
        <CartStateContext.Provider value={{ cart, addToCart, updateQuantity, refreshCart, cartStatus }}>
            {children}
        </CartStateContext.Provider>
    )
}