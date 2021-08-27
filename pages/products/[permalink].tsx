import { Product } from '@chec/commerce.js/types/product';
import { GetStaticPropsContext } from 'next';
import { Layout } from '../../components';
import { CART_STATES, useCartState } from '../../context/cart';
import commerce from "../../lib/commerce";
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Lightbox from 'react-image-lightbox'

interface ProductPageProps {
    product: Product
}

const MINIMUM_QUANTITY = 1
export default function Permalink({ product }: ProductPageProps) {
    const [currentPrice, setCurrentPrice] = useState(product.price.raw)
    const [variantSelections, setVariantSelections] = useState(Object.fromEntries(product.variant_groups.map(group => [group.id, group.options[0].id])))

    const [quantity, setQuantity] = useState(MINIMUM_QUANTITY)
    const isValidQuantity = !Number.isNaN(quantity)

    useEffect(() => {
        if (Number.isNaN(quantity)) return
        let finalPrice = product.price.raw
        for (const [category, value] of Object.entries(variantSelections)) {
            finalPrice += product.variant_groups.find(group => group.id === category)!.options.find(option => option.id === value)!.price.raw
        }
        setCurrentPrice(finalPrice * quantity)
    }, [quantity, product.price.raw, product.variant_groups, variantSelections])


    const { addToCart, cartStatus } = useCartState()
    const handleAddToCart = async () => {
        if (!isValidQuantity) return
        addToCart(product.id, quantity, variantSelections)
    }

    const productImages = product.assets.length > 0 ? product.assets.map(asset => asset.url) : ['/no_image_placeholder.svg']
    const [photoIndex, setPhotoIndex] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const handleCarouselChange = (index: number) => setPhotoIndex(index)
    return (
        <Layout title={product.name}>
            <div className="lg:flex lg:flex-row justify-center mb-8 lg:p-16">
                <div className="p-4 max-w-xl mx-auto lg:mx-0 lg:sticky top-0 self-start">
                    <Carousel onChange={handleCarouselChange} showStatus={false} showIndicators={false} autoPlay={false} showThumbs={productImages.length > 1} infiniteLoop dynamicHeight
                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                            hasPrev && (
                                <button type="button" onClick={onClickHandler} title={label} style={{ zIndex: 1 }} className="absolute left-0 top-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-bold text-xl flex items-center justify-center">
                                    <img src="/left.svg" alt="Prev" />
                                </button>
                            )
                        }
                        renderArrowNext={(onClickHandler, hasNext, label) =>
                            hasNext && (
                                <button type="button" onClick={onClickHandler} title={label} style={{ zIndex: 1 }} className="absolute right-0 top-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-bold text-xl flex items-center justify-center">
                                    <img src="/right.svg" alt="Next" />
                                </button>
                            )
                        }
                    >
                        {productImages.map(img => <div key={img} className="flex items-center cursor-pointer" onClick={() => setIsOpen(c => !c)}><img src={img} alt={product.name} /></div>)}
                    </Carousel>
                    {isOpen && (
                        <Lightbox
                            mainSrc={productImages[photoIndex]}
                            nextSrc={productImages[(photoIndex + 1) % productImages.length]}
                            prevSrc={productImages[(photoIndex + productImages.length - 1) % productImages.length]}
                            onCloseRequest={() => setIsOpen(false)}
                            onMovePrevRequest={() => setPhotoIndex(prevIndex => (prevIndex + productImages.length - 1) % productImages.length)}
                            onMoveNextRequest={() => setPhotoIndex(prevIndex => (prevIndex + 1) % productImages.length)}
                        />
                    )}
                </div>
                <div className="p-4 max-w-xl sticky top-0 flex flex-col mx-auto lg:mx-0 self-start">
                    <div className="flex gap-x-4 gap-y-2">
                        {product.categories.map(category => (
                            <h2 key={category.id} className="text-sm title-font text-gray-500 tracking-widest">
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
                            <div className="flex flex-col" key={group.id}>
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
