import { LineItem } from "@chec/commerce.js/types/line-item";
import Link from 'next/link'
import Image from 'next/image'
import { useCartState } from "../../context/cart";


interface CartItemProps {
    item: LineItem
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity } = useCartState()
    return (
        <div className="flex p-4 gap-x-4 w-full">
            <Link href={`/products/${(item as any).permalink}`}>
                <a className="block relative h-36 w-36 rounded overflow-hidden">
                    <img className="object-cover object-center w-full h-full block" src={item.media.source ? item.media.source : '/no_image_placeholder.svg'} alt={item.name} />
                </a>
            </Link>
            <div className="w-full">
                <Link href={`/products/${(item as any).permalink}`}><a><h2 className="text-lg font-semibold hover:underline">{item.name}</h2></a></Link>
                {(item as any).selected_options && <p className="font-medium opacity-75">{(item as any).selected_options.map((option: any) => option.option_name).join(', ')}</p>}
                <div className="flex items-center justify-between w-full opacity-75">
                    <div className="flex items-center my-2 rounded-lg border-2 border-gray-200">
                        <button className="opacity-50 hover:opacity-100 hover:bg-gray-100 text-lg py-2 px-4 border-r border-gray-200 mr-4 h-12 w-12 font-bold flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <p className="text-lg font-semibold">{item.quantity}</p>
                        <button className="opacity-75 hover:opacity-100 hover:bg-gray-100 text-lg py-2 px-4 border-l border-gray-200 ml-4 h-12 w-12 font-bold flex items-center justify-center" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => updateQuantity(item.id, 0)} className="opacity-50 hover:opacity-75"><Image src={"/delete.svg"} alt="Delete item" width={32} height={32} /></button>
                </div>
                <p className="font-bold text-lg">{item.line_total.formatted_with_code}</p>
            </div>
        </div>
    )
}
