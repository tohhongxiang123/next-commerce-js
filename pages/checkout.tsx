import { GetShippingOptionsResponse } from "@chec/commerce.js/features/checkout"
import { CheckoutToken } from "@chec/commerce.js/types/checkout-token"
import React, { useEffect, useState } from "react"
import { useCartState } from "../context/cart"
import commerce from '../lib/commerce'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useRouter } from "next/dist/client/router"

export default function CheckoutForm() {
    const { cart, refreshCart } = useCartState()
    const router = useRouter()
    const [checkoutToken, setCheckoutToken] = useState<CheckoutToken | null>(null)
    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
                console.log(token)
                setCheckoutToken(token)
            } catch (err) {
                console.log("Generate token error", err)
            }
        }
        if (cart.id && cart.total_items > 0) generateToken()
    }, [cart, router])

    const [addressForm, setAddressForm] = useState({ firstName: '', lastName: '', address: '', email: '', city: '', postalCode: '' })
    const updateAddressForm = (key: keyof typeof addressForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddressForm(oldValues => ({ ...oldValues, [key]: e.target.value }))
    }

    const [selectedShippingCountry, setSelectedShippingCountry] = useState('')
    const [availableShippingCountries, setAvailableShippingCountries] = useState<{ [key: string]: string }>({})
    const fetchShippingCountries = async (checkoutTokenId: string) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
        console.log({ countries })
        setAvailableShippingCountries(countries)
        setSelectedShippingCountry(Object.keys(countries)[0])
    }
    useEffect(() => {
        if (checkoutToken) fetchShippingCountries(checkoutToken.id)
    }, [checkoutToken])

    const [selectedShippingSubdivision, setSelectedShippingSubdivision] = useState('')
    const [availableShippingSubdivisions, setAvailableShippingSubdivisions] = useState<{ [key: string]: string }>({})
    const fetchSubdivisions = async (countryCode: string) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)
        console.log({ subdivisions }, Object.keys(subdivisions)[0])
        setAvailableShippingSubdivisions(subdivisions)
        setSelectedShippingSubdivision(Object.keys(subdivisions)[0])
    }
    useEffect(() => {
        if (selectedShippingCountry) fetchSubdivisions(selectedShippingCountry)
    }, [selectedShippingCountry])

    const [selectedShippingOption, setSelectedShippingOption] = useState<string>('')
    const [availableShippingOptions, setAvailableShippingOptions] = useState<GetShippingOptionsResponse[]>([] as any)
    const fetchShippingOptions = async (checkoutTokenId: string, countryCode: string) => {
        const options: GetShippingOptionsResponse[] = await commerce.checkout.getShippingOptions(checkoutTokenId, { country: countryCode }) as any
        console.log({ options })
        setAvailableShippingOptions(options)
        setSelectedShippingOption(options[0].id)
    }
    useEffect(() => {
        if (checkoutToken?.id && selectedShippingCountry) fetchShippingOptions(checkoutToken.id, selectedShippingCountry)
    }, [checkoutToken?.id, selectedShippingCountry])

    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // pre submit check
        if (!stripe || !elements) return
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) return

        // create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement })

        // failed to create payment method
        if (error || !paymentMethod) {
            return console.log("Create payment method fail", error)
        }

        let incomingOrder;
        const orderData = {
            line_items: checkoutToken?.live.line_items,
            customer: { firstname: addressForm.firstName, lastname: addressForm.lastName, email: addressForm.email },
            shipping: {
                name: `${addressForm.firstName} ${addressForm.lastName}`,
                street: addressForm.address,
                town_city: addressForm.city,
                county_state: selectedShippingSubdivision,
                postal_zip_code: addressForm.postalCode,
                country: selectedShippingCountry
            },
            fulfillment: { shipping_method: selectedShippingOption },
            payment: {
                gateway: 'stripe'
            }
        }

        try {
            // try to pay for order
            incomingOrder = await commerce.checkout.capture(checkoutToken!.id, { ...orderData, payment: { ...orderData.payment, stripe: { payment_method_id: paymentMethod.id } } } as any)
            console.log(incomingOrder)
        } catch (e) {
            // failed to pay for order
            if (e.statusCode !== 402 || e.data.error.type !== 'requires_verification') {
                // Handle the error as usual because it's not related to 3D secure payments
                console.log(e)
                return;
            }

            // handle additional verification for payment
            const cardActionResult = await stripe.handleCardAction(e.data.error.param)
            if (cardActionResult.error) {
                // The customer failed to authenticate themselves with their bank and the transaction has been declined
                alert(cardActionResult.error.message);
                return;
            }

            // try again to pay for order
            try {
                incomingOrder = await commerce.checkout.capture(checkoutToken!.id, { ...orderData, payment: { ...orderData.payment, stripe: { payment_intent_id: cardActionResult.paymentIntent!.id } } } as any)
            } catch (e) {
                // irrecoverable
                console.log("Really failed holy shit", e)
                return
            }
        }

        // everything is complete
        console.log("Completed", { incomingOrder })
        alert("Success")
        refreshCart()
        router.push('/')
    }

    return (
        <>
            <h1 className="font-bold text-3xl">Checkout</h1>
            <div>
                <form className="flex flex-col gap-2 p-4">
                    <h2 className="font-semibold text-xl">Personal Details</h2>
                    {Object.entries(addressForm).map(([key, value]) => (
                        <div key={key}>
                            <label htmlFor={key}>{key}</label>
                            <input id={key} value={value} onChange={updateAddressForm(key as keyof typeof addressForm)} key={key} />
                        </div>
                    ))}
                    {Object.entries(availableShippingCountries).length > 0 && <>
                        <h2 className="font-semibold text-xl">Shipping Address</h2>
                        <label htmlFor={"Country"}>Country</label>
                        <select id={"Country"} value={selectedShippingCountry} onChange={e => setSelectedShippingCountry(e.target.value)}>
                            {Object.entries(availableShippingCountries).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                        </select>
                        <label htmlFor={"Sub-division"}>Sub-division</label>
                        <select id={"Sub-division"} value={selectedShippingSubdivision} onChange={e => setSelectedShippingSubdivision(e.target.value)}>
                            {Object.entries(availableShippingSubdivisions).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                        </select>
                        <label htmlFor={"Option"}>Option</label>
                        <select id={"Option"} value={selectedShippingOption} onChange={e => setSelectedShippingOption(e.target.value)}>
                            {availableShippingOptions.map(option => <option key={option.id} value={option.id}>{option.description} (+{option.price.formatted_with_symbol})</option>)}
                        </select>
                    </>}
                </form>
                {checkoutToken && <div>
                    <div className="p-4">
                        <h2 className="font-bold text-xl">Order Summary</h2>
                        <ul>
                            {checkoutToken.live.line_items.length > 0 ? checkoutToken.live.line_items.map(product => (
                                <li key={product.id}>
                                    <p>{product.name} x {product.quantity}</p>
                                    <p>{product.line_total.formatted_with_code}</p>
                                </li>
                            )) : (
                                <p>Cart is Empty</p>
                            )}
                        </ul>
                        <p>Order total: {checkoutToken?.live.subtotal.formatted_with_code}</p>
                    </div>
                    <div className="p-4">
                        <h2 className="font-bold text-xl">Payment Methods</h2>
                        <form onSubmit={handleSubmit}>
                            <CardElement />
                            <br /> <br />
                            <div>
                                <button disabled={!stripe}>Pay {checkoutToken.live.subtotal.formatted_with_code}</button>
                            </div>
                        </form>
                    </div>
                </div>}
            </div>
        </>
    )
};