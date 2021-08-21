import { Category } from "@chec/commerce.js/types/category";

export default function DisplayCategory({ name }: Category) {
    return <p>{name}</p>;
}
