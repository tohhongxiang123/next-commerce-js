import { Category } from '@chec/commerce.js/types/category'
import { PaginationMeta } from '@chec/commerce.js/types/pagination'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { CategoryList, Layout, Pagination } from '../../components'
import commerce from '../../lib/commerce'

interface CategoriesPageProps {
    categories: Category[],
    pagination: PaginationMeta['pagination']
}

export default function index({ categories, pagination }: CategoriesPageProps) {
    return (
        <Layout title="Categories">
            <div className="p-4">
                <h1 className="text-3xl font-semibold mb-8 opacity-75">Categories</h1>
                <CategoryList categories={categories} />
                <div className="flex justify-end my-2">
                    <Pagination currentPage={pagination.current_page} pageLimit={pagination.per_page} totalCount={pagination.total} />
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { data: categories, meta: { pagination } } = await commerce.categories.list();
    return {
        props: {
            categories, pagination
        },
    };
}
