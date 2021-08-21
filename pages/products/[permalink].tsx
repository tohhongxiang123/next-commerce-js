import { Product } from '@chec/commerce.js/types/product';
import { GetStaticPropsContext } from 'next';
import { useCartState } from '../../context/cart';
import commerce from "../../lib/commerce";

interface ProductPageProps {
    product: Product
}

export default function Permalink({ product }: ProductPageProps) {
    const { addToCart } = useCartState()

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.price.formatted_with_symbol}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
        </div>
    )
}

export async function getStaticPaths() {
    const { data: products } = await commerce.products.list();

    return {
        paths: products.map((product) => ({
            params: {
                permalink: product.permalink,
            },
        })),
        fallback: false,
    };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
    const { permalink } = params as { permalink: string };

    const product = await commerce.products.retrieve(permalink, {
        type: 'permalink',
    });

    return {
        props: {
            product,
        },
    };
}
