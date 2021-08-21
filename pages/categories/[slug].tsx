import React from 'react'
import commerce from "../../lib/commerce";
import { ProductList } from "../../components";
import { GetStaticPropsContext } from 'next';
import { Category } from '@chec/commerce.js/types/category';
import { Product } from '@chec/commerce.js/types/product';

interface CategoriesSlugProps {
    category: Category,
    products: Product[]
}

export default function slug({ category, products }: CategoriesSlugProps) {
    return (
        <div>
            <h1>Category - {category.name}</h1>
            <ProductList products={products} />
        </div>
    )
}

export async function getStaticPaths() {
    const { data: categories } = await commerce.categories.list();

    return {
        paths: categories.map((category) => ({
            params: {
                slug: category.slug,
            },
        })),
        fallback: false,
    };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
    const { slug } = params as { slug: string };

    const category = await commerce.categories.retrieve(slug, {
        type: "slug",
    });

    const { data: products } = await commerce.products.list({
        category_slug: [slug],
    });

    return {
        props: {
            category,
            products,
        },
    };
}
