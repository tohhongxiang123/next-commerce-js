import commerce from '../../lib/commerce'
import { Product } from '@chec/commerce.js/types/product'
import React from 'react'
import { Layout, ProductList } from '../../components'

interface ProductsPageProps {
    products: Product[]
}

export default function index({ products }: ProductsPageProps) {
    return (
        <Layout title="Products">
            <h1>Products</h1>
            <ProductList products={products} />
        </Layout>
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