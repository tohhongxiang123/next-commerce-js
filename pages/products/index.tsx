import commerce from '../../lib/commerce'
import { Product } from '@chec/commerce.js/types/product'
import React from 'react'
import { ProductList } from '../../components'

interface ProductsPageProps {
    products: Product[]
}

export default function index({ products }: ProductsPageProps) {
    return (
        <div>
            <h1>Products</h1>
            <ProductList products={products} />
        </div>
    )
}

export async function getStaticProps() {
    const { data: products } = await commerce.products.list()
    return {
        props: {
            products
        }
    }
}