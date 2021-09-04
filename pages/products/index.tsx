import commerce from '../../lib/commerce'
import { Product } from '@chec/commerce.js/types/product'
import React from 'react'
import {
    DisplayProduct,
    Layout,
} from '../../components'
import { GetServerSidePropsContext } from 'next'
import { PaginationMeta } from '@chec/commerce.js/types/pagination'
import algoliasearch from 'algoliasearch/lite';
import {
    InstantSearch,
    Hits,
    SearchBox,
    RefinementList,
    Pagination,
    Highlight,
    HitsPerPage,
} from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

interface ProductsPageProps {
    products: Product[],
    pagination: PaginationMeta['pagination']
}

export default function index({ products, pagination }: ProductsPageProps) {
    const handleSubmitQuery = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <Layout title="Products">
            <div>
                <InstantSearch searchClient={searchClient} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX as string} >
                    <div className="flex justify-between p-4">
                        <h1 className="text-3xl font-semibold opacity-75">Products</h1>
                        <SearchBox
                            className="searchbox"
                            translations={{
                                placeholder: 'Search',
                            }}
                            onSubmit={handleSubmitQuery}
                            showLoadingIndicator
                        />
                    </div>
                    <Hits hitComponent={({ hit }) => <DisplayProduct product={hit as any} />} />
                    <div className="flex justify-end gap-x-8 p-4">
                        <HitsPerPage defaultRefinement={2} items={[
                            { value: 2, label: 'Limit to 2 items per page' },
                            { value: 20, label: 'Limit to 20 items per page' },
                            { value: 50, label: 'Limit to 50 items per page' },
                            { value: 100, label: 'Limit to 100 items per page' },
                        ]} />
                        <Pagination />
                    </div>
                </InstantSearch>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { data: products, meta: { pagination } } = await commerce.products.list()

    return {
        props: {
            products, pagination
        }
    }
}