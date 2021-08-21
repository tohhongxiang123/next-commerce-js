import { Category } from '@chec/commerce.js/types/category'
import { Merchant } from '@chec/commerce.js/types/merchant'
import { Product } from '@chec/commerce.js/types/product'
import commerce from '../lib/commerce'
import { CategoryList, ProductList } from '../components'
import Link from 'next/link'
import Image from 'next/image'
import { useCartState } from '../context/cart'

interface HomeProps {
	merchant: any,
	categories: Category[],
	products: Product[]
}

export default function Home({ merchant, categories, products }: HomeProps) {
	const MERCHANT_IMAGE_HEIGHT = 256

	return (
		<div>
			<div className="p-8">
				<h1>{merchant.name}</h1>
				<div dangerouslySetInnerHTML={{ __html: merchant.description }} />
				<Image src={merchant.images.logo.url} alt={`${merchant.name}'s logo`} height={MERCHANT_IMAGE_HEIGHT} width={MERCHANT_IMAGE_HEIGHT / merchant.images.logo.image_dimensions.height * merchant.images.logo.image_dimensions.width} />
			</div>
			<div className="p-8">
				<h2 className="text-xl font-bold"><Link href={"/categories"}><a>Categories</a></Link></h2>
				<CategoryList categories={categories} />
			</div>
			<div className="p-8">
				<h2 className="text-xl font-bold"><Link href={"/products"}><a>Products</a></Link></h2>
				<ProductList products={products} />
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const { data: merchants } = await commerce.merchants.about() as any
	const merchant: Merchant = merchants[0]
	const { data: categories } = await commerce.categories.list()
	const { data: products } = await commerce.products.list()

	return {
		props: {
			merchant, categories, products
		}
	}
}
