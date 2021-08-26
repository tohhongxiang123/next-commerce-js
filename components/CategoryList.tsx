import { Category } from '@chec/commerce.js/types/category';
import React from 'react'
import Link from "next/link";
import DisplayCategory from './DisplayCategory';

interface CategoryListProps {
    categories: Category[]
}

export default function CategoryList({ categories = [] }: CategoryListProps) {
    return (
        <ul className="flex flex-wrap">
            {categories.map((category) => (
                <li key={category.id} className="lg:w-1/3 md:w-1/2 p-4 w-full">
                    <DisplayCategory {...category} />
                </li>
            ))}
        </ul>
    );
}