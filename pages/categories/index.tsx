import { Category } from '@chec/commerce.js/types/category'
import React from 'react'
import { CategoryList, Layout } from '../../components'
import commerce from '../../lib/commerce'

interface CategoriesPageProps {
    categories: Category[]
}

export default function index({ categories }: CategoriesPageProps) {
    return (
        <Layout title="Categories">
            <div className="p-4">
                <h1 className="text-3xl font-semibold mb-8 opacity-75">Categories</h1>
                <CategoryList categories={categories} />
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
    const { data: categories } = await commerce.categories.list();

    return {
        props: {
            categories,
        },
    };
}
