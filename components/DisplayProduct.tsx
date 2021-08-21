import { Product } from "@chec/commerce.js/types/product";

export default function DisplayProduct({ id, permalink, name, description, price }: Product) {
    return (
        <div>
            <p className="font-semibold">{name}</p>
            <p>{price.formatted_with_symbol}</p>
        </div>
    )
}