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
            <div className="p-8">
                <h1 className="text-3xl font-semibold mb-8 opacity-75">Products</h1>
                <ProductList products={products} />
            </div>
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