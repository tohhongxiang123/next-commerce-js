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
    connectRefinementList,
} from 'react-instantsearch-dom';
import { useRouter } from 'next/router'

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);

const FILTER_ATTRIBUTE = 'categories.name'
const INDEX_NAME = 'products'
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
            <div className="h-full overflow-hidden flex flex-col">
                <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}
                    searchState={searchState}
                    onSearchStateChange={handleSearchStateChange}
                >
                    <div className="flex justify-between items-center p-4">
                        <h1 className="text-3xl font-semibold opacity-75">Products</h1>
                        <SearchBox
                            className="form-input"
                            translations={{
                                placeholder: 'Search',
                            }}
                            searchAsYouType={false}
                        />
                    </div>
                    <div className="flex h-full overflow-hidden">
                        <div className="flex-shrink-0 pt-4 pl-2 pr-8 overflow-auto">
                            <ConnectedRefinementListComponent attribute={FILTER_ATTRIBUTE} />
                        </div>
                        <div className="flex-grow overflow-auto">
                            <ConnectedHitsComponent />
                            <div className="flex justify-end gap-x-8 p-4">
                                <HitsPerPage defaultRefinement={20} items={[
                                    { value: 2, label: 'Limit to 2 items per page' },
                                    { value: 20, label: 'Limit to 20 items per page' },
                                    { value: 50, label: 'Limit to 50 items per page' },
                                    { value: 100, label: 'Limit to 100 items per page' },
                                ]} />
                                <Pagination showLast default />
                            </div>
                        </div>
                    </div>
                </InstantSearch>
            </div>
        </Layout>
    )
}

const ConnectedHitsComponent = connectHits(({ hits = [] }) => <ProductList products={hits as any} />)

const ConnectedRefinementListComponent = connectRefinementList(({ canRefine, createURL, currentRefinement, isFromSearch, items, refine }) => (
    <>
        <ul>
            {items.map(item => (
                <li className="px-2 mb-2">
                    <label className="inline-flex gap-x-2 items-center">
                        <input type="checkbox" className="form-checkbox rounded border border-gray-400" checked={item.isRefined} value={item.value} onChange={e => refine(item.value)} />
                        <span>{item.label} - {item.count}</span>
                    </label>
                </li>
            ))}
        </ul>
    </>
))