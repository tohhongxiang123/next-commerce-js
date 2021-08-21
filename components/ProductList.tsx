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
            <ul>
                {products.map(product => (
                    <li key={product.id}>
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
