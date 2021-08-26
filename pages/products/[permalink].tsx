import { Categories } from '@chec/commerce.js/features/categories';
import { Product } from '@chec/commerce.js/types/product';
import { GetStaticPropsContext } from 'next';
import { Layout } from '../../components';
import { CART_STATES, useCartState } from '../../context/cart';
import commerce from "../../lib/commerce";
import Link from 'next/link'
import { useEffect, useState } from 'react';

interface ProductPageProps {
    product: Product
}

const MINIMUM_QUANTITY = 1
export default function Permalink({ product }: ProductPageProps) {
    const [currentPrice, setCurrentPrice] = useState(product.price.raw)
    useEffect(() => {
        if (Number.isNaN(quantity)) return
        let finalPrice = product.price.raw
        for (const [category, value] of Object.entries(variantSelections)) {
            finalPrice += product.variant_groups.find(group => group.id === category)!.options.find(option => option.id === value)!.price.raw
        }
        setCurrentPrice(finalPrice * quantity)
    })

    const [quantity, setQuantity] = useState(MINIMUM_QUANTITY)
    const isValidQuantity = !Number.isNaN(quantity)

    const [variantSelections, setVariantSelections] = useState(Object.fromEntries(product.variant_groups.map(group => [group.id, group.options[0].id])))

    const { addToCart, cartStatus } = useCartState()
    const handleAddToCart = async () => {
        if (!isValidQuantity) return
        addToCart(product.id, quantity, variantSelections)
    }

    return (
        <Layout title={product.name}>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                            src={product.assets[0] ? product.assets[0].url : '/no_image_placeholder.svg'}
                            alt={product.assets[0] ? product.assets[0].filename : product.name}
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <div className="flex gap-x-4 gap-y-2">
                                {product.categories.map(category => (
                                    <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                        <Link href={`/categories/${category.slug}`}>
                                            <a>
                                                {category.name.toUpperCase()}
                                            </a>
                                        </Link>
                                    </h2>
                                ))}
                            </div>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.name}</h1>
                            <div className="leading-relaxed prose text-gray-500 " dangerouslySetInnerHTML={{ __html: product.description }} />
                            <div className="flex flex-wrap gap-4 mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                                {product.variant_groups.map(group => (
                                    <div className="flex flex-col">
                                        <label className="mr-3 font-medium" htmlFor={group.id}>{group.name}</label>
                                        <div className="relative">
                                            <select id={group.id} value={variantSelections[group.name]} onChange={e => setVariantSelections(c => ({ ...c, [group.id]: e.target.value }))} className="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-10">
                                                {group.options.map(option => <option key={option.id} value={option.id}>{option.name} {option.price.raw !== 0 && `(${option.price.raw > 0 ? '+' : ''}${option.price.formatted_with_code})`}</option>)}
                                            </select>
                                            <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                                    <path d="M6 9l6 6 6-6"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex flex-col">
                                    <label className="mr-3 font-medium" htmlFor="quantity">Quantity</label>
                                    <input min={1} step={1} type="number" id="quantity" value={quantity}
                                        onChange={e => setQuantity(parseInt(e.target.value))}
                                        className="w-24 rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base px-3"
                                    />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-x-4">
                                <span className="title-font font-medium text-2xl text-gray-900">${currentPrice}</span>
                                <button className={`flex ml-auto text-white font-medium bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded ${(!isValidQuantity || cartStatus.status === CART_STATES.LOADING) && "pointer-events-none opacity-50"}`}
                                    onClick={handleAddToCart} disabled={!isValidQuantity || cartStatus.status === CART_STATES.LOADING || cartStatus.status === CART_STATES.SUCCESS}
                                >{cartStatus.status !== CART_STATES.IDLE ? cartStatus.message : "Add to Cart"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export async function getStaticPaths() {
    const { data: products } = await commerce.products.list();

    return {
        paths: products.map((product) => ({
            params: {
                permalink: product.permalink,
            },
        })),
        fallback: false,
    };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
    const { permalink } = params as { permalink: string };

    const product = await commerce.products.retrieve(permalink, {
        type: 'permalink',
    });

    return {
        props: {
            product,
        },
    };
}
