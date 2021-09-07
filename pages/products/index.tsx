import React, { useEffect, useState } from 'react'
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
    RefinementList,
} from 'react-instantsearch-dom';
import { useRouter } from 'next/router'
import { Product } from '@chec/commerce.js/types/product';
import { Category } from '@chec/commerce.js/types/category';

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const FILTER_ATTRIBUTE = 'categories.name'
export default function index() {
    const router = useRouter()

    const [searchState, setSearchState] = useState({})

    useEffect(() => { // on mount, take query params from url, and set searchState
        const { categories, ...queryObject } = router.query
        setSearchState({ ...queryObject, refinementList: { [FILTER_ATTRIBUTE]: categories ?? [] } })
    }, [router])

    const handleSearchStateChange = (updatedSearchState: any) => { // everytime search state changes, update url
        const { refinementList, ...queryObject } = updatedSearchState
        const categories = refinementList[FILTER_ATTRIBUTE]

        router.push({ query: { ...queryObject, categories } })
        setSearchState(updatedSearchState)
    }

    return (
        <Layout title="Products">
            <div>
                <InstantSearch searchClient={searchClient} indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX as string}
                    searchState={searchState}
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
                    <div>
                        <RefinementList attribute={FILTER_ATTRIBUTE} on />
                    </div>
                    <ConnectedHitsComponent />
                    <div className="flex justify-end gap-x-8 p-4">
                        <HitsPerPage defaultRefinement={20} items={[
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