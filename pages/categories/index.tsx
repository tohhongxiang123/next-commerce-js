import { Category } from '@chec/commerce.js/types/category'
import { PaginationMeta } from '@chec/commerce.js/types/pagination'
import React, { useEffect, useState } from 'react'
import {
    CategoryList,
    Layout,
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


interface CategoriesPageProps {
    categories: Category[],
    pagination: PaginationMeta['pagination']
}

const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string,
);


const INDEX_NAME = "categories"
export default function index({ categories, pagination }: CategoriesPageProps) {
    const router = useRouter()
    const [searchState, setSearchState] = useState({})

    useEffect(() => { // on mount, take query params from url, and set searchState
        setSearchState(router.query)
    }, [router])

    const handleSearchStateChange = (updatedSearchState: any) => { // everytime search state changes, update url
        router.push({ query: updatedSearchState })
        setSearchState(updatedSearchState)
    }

    return (
        <Layout title="Categories">
            <div className="p-4">
                <InstantSearch searchClient={searchClient} indexName={INDEX_NAME}
                    searchState={searchState}
                    onSearchStateChange={handleSearchStateChange}
                >
                    <div className="flex justify-between items-center p-4">
                        <h1 className="text-3xl font-semibold opacity-75">Categories</h1>
                        <SearchBox
                            className="form-input"
                            translations={{
                                placeholder: 'Search',
                            }}
                            searchAsYouType={false}
                        />
                    </div>
                    <div>
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
                </InstantSearch>
            </div>
        </Layout>
    )
}

const ConnectedHitsComponent = connectHits(({ hits = [] }) => <CategoryList categories={hits as any} />)
