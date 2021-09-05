import React from 'react'
import {
    Layout,
    ProductList,
} from '../../components'
import algoliasearch from 'algoliasearch/lite';
import {
    InstantSearch,
    SearchBox,
    Pagination,
    HitsPerPage,
    connectHits,
} from 'react-instantsearch-dom';
import { useRouter } from 'next/router'

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

export default function index() {
    const router = useRouter()

    const handleSearchStateChange = ({ query, page }: any) => {
        const queryObject = { page } as any

        if (query) {
            queryObject.search = query
        }
        router.push({ query: queryObject })
    }

    return (
        <Layout title="Products">
            <div>
                <InstantSearch searchClient={searchClient} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX as string} 
                    searchState={{ query: router.query.search ?? "", page: router.query.page ?? 1 }}
                    onSearchStateChange={handleSearchStateChange}
                >
                    <div className="flex justify-between p-4">
                        <h1 className="text-3xl font-semibold opacity-75">Products</h1>
                        <SearchBox
                            className="searchbox"
                            translations={{
                                placeholder: 'Search',
                            }}
                            searchAsYouType={false}
                        />
                    </div>
                    <ConnectedHitsComponent />
                    <div className="flex justify-end gap-x-8 p-4">
                        <HitsPerPage defaultRefinement={2} items={[
                            { value: 2, label: 'Limit to 2 items per page' },
                            { value: 20, label: 'Limit to 20 items per page' },
                            { value: 50, label: 'Limit to 50 items per page' },
                            { value: 100, label: 'Limit to 100 items per page' },
                        ]} />
                        <Pagination showLast default />
                    </div>
                </InstantSearch>
            </div>
        </Layout>
    )
}

const ConnectedHitsComponent = connectHits(({ hits = [] }) => <ProductList products={hits as any} />)