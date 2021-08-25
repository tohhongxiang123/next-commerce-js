import { Product } from '@chec/commerce.js/types/product'
import React from 'react'
import Link from 'next/link'
import DisplayProduct from './DisplayProduct'

interface ProductListProps {
    products: Product[]
}

export default function ProductList({ products = [] }: ProductListProps) {
    return (
        <div>
            <ul className="flex flex-wrap gap-8 w-full">
                {products.map(product => (
                    <li key={product.id} className="lg:w-1/4 md:w-1/2 p-4 w-full shadow-sm rounded-sm">
                        <Link href={`/products/${product.permalink}`} passHref>
                            <a>
                                <DisplayProduct {...product} />
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
