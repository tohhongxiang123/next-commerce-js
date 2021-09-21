import { Category } from "@chec/commerce.js/types/category";
import Link from 'next/link'

export default function DisplayCategory({ name, ...props }: Category) {
    const redirectLink = `/products?categories=${props.slug}`
    return (
        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
            <Link href={redirectLink}>
                <a>
                    <img className="lg:h-48 md:h-36 w-full object-cover object-center" src={(props as any).assets.length > 0 ? (props as any).assets[0].url : "/no_image_placeholder.svg"} alt={name} />
                </a>
            </Link>
            <div className="p-6">
                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">{name}</h1>
                <div className="leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: props.description }} />
                <div className="flex items-center flex-wrap ">
                    <Link href={redirectLink}>
                        <a className="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0">View Products
                            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="M12 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </Link>
                    <span className="text-gray-400 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm py-1">
                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>{props.products} {props.products === 1 ? "product" : "products"}
                    </span>
                </div>
            </div>
        </div>
    )
}
