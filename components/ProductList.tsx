import { Product } from '@chec/commerce.js/types/product'
import React from 'react'
import DisplayProduct from './DisplayProduct'

interface ProductListProps {
    products: Product[]
}

export default function ProductList({ products = [] }: ProductListProps) {
    return (
        <div>
            {products.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-8">
                {products.map(product => (
                    <li key={product.id} className="lg:w-1/4 md:w-1/3 w-full shadow-sm rounded-sm">
                        <DisplayProduct product={product} />
                    </li>
                ))}
            </ul>
            ) : (
               <p className="text-center text-lg font-medium opacity-50 py-16 px-4"><i>No products found...</i></p>
            )}
        </div>
    )
}
