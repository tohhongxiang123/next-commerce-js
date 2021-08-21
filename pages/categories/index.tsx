import { Category } from '@chec/commerce.js/types/category'
import React from 'react'
import { CategoryList } from '../../components'
import commerce from '../../lib/commerce'

interface CategoriesPageProps {
    categories: Category[]
}

export default function index({ categories }: CategoriesPageProps) {
    return (
        <div>
            <h1>Categories</h1>
            <CategoryList categories={categories} />
        </div>
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
