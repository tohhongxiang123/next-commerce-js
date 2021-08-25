import { Category } from '@chec/commerce.js/types/category'
import { Merchant } from '@chec/commerce.js/types/merchant'
import { Product } from '@chec/commerce.js/types/product'
import commerce from '../lib/commerce'
import { CategoryList, ProductList, Layout } from '../components'
import Link from 'next/link'

interface HomeProps {
	categories: Category[],
	products: Product[]
}

export default function Home({ categories, products }: HomeProps) {

	return (
		<Layout>
			<div className="p-8">
				<h2 className="text-3xl font-semibold mb-8 opacity-75"><Link href={"/categories"}><a>Categories</a></Link></h2>
				<CategoryList categories={categories} />
			</div>
			<div className="p-8">
				<h2 className="text-3xl font-semibold mb-8 opacity-75"><Link href={"/products"}><a>Products</a></Link></h2>
				<ProductList products={products} />
			</div>
		</Layout>
	)
}

export async function getStaticProps() {
	const { data: categories } = await commerce.categories.list()
	const { data: products } = await commerce.products.list()

	return {
		props: {
			categories, products
		}
	}
}
