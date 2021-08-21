import { Category } from '@chec/commerce.js/types/category';
import React from 'react'
import Link from "next/link";
import DisplayCategory from './DisplayCategory';

interface CategoryListProps {
    categories: Category[]
}

export default function CategoryList({ categories = [] }: CategoryListProps) {
    return (
        <ul>
            {categories.map((category) => (
                <li key={category.id}>
                    <Link href={`/categories/${category.slug}`}>
                        <a>
                            <DisplayCategory {...category} />
                        </a>
                    </Link>
                </li>
            ))}
        </ul>
    );
}