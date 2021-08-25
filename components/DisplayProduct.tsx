import { Product } from "@chec/commerce.js/types/product";
import Link from 'next/link'

const MAX_SHOWN_CATEGORIES = 5
export default function DisplayProduct({ id, permalink, name, description, price, categories, ...props }: Product) {
    const coverImage = props.assets[0]
    return (
        <div className="p-4 w-full h-full">
            <Link href={`/products/${permalink}`}>
                <a className="block relative h-48 rounded overflow-hidden">
                    <img className="object-cover object-center w-full h-full block" src={coverImage ? coverImage.url : '/no_image_placeholder.svg'} alt={coverImage ? coverImage.filename : name} />
                </a>
            </Link>
            <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{categories.slice(0, MAX_SHOWN_CATEGORIES).map(category => category.name.toUpperCase()).join(', ')}</h3>
                <h2 className="text-gray-900 title-font text-lg font-medium"><Link href={`/products/${permalink}`}><a>{name}</a></Link></h2>
                <p className="mt-1">{price.formatted_with_symbol}</p>
            </div>
        </div>
    )
}