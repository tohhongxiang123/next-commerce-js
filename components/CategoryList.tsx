import { Category } from '@chec/commerce.js/types/category';
import React from 'react'
import DisplayCategory from './DisplayCategory';

interface CategoryListProps {
    categories: Category[]
}

export default function CategoryList({ categories = [] }: CategoryListProps) {
    return (
        <ul className="flex flex-wrap">
            {categories.length > 0 ? categories.map((category) => (
                <li key={category.id} className="lg:w-1/3 md:w-1/2 m-4 w-full">
                    <DisplayCategory {...category} />
                </li>
            )) : (
                <p className="text-center text-lg font-medium opacity-50 p-4"><i>No categories found...</i></p>
            )}
        </ul>
    );
}