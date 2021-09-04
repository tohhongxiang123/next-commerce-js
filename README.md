# Setting up

Create a `.env` and fill up the following

- `NEXT_PUBLIC_CHEC_PUBLIC_API_KEY` - commerce js public api key
- `NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY` - stripe public api key
- `NEXT_PUBLIC_ALGOLIA_APPLICATION_ID` - algolia application id
- `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` - algolia search only api key
- `NEXT_PUBLIC_ALGOLIA_INDEX` - name of algolia index
- `ALGOLIA_ADMIN_API_KEY` - algolia admin api key


# Tutorial

## Create a NextJS app with typescript

```
npx create-text-app --ts
```

Over here, I run `npm run dev` to let NextJS create a `tsconfig.json` file for me, then i set `strict: true`.

## Install CommerceJS

```bash
npm install @chec/commerce.js
npm install -D @chec/commerce.js @types/chec__commerce.js # for typescript
```

Create a `.env` file, and fill up `NEXT_PUBLIC_CHEC_PUBLIC_API_KEY` from CommerceJS. (You'll need to go to [commerceJS website](https://commercejs.com/) to create an account to get the public api key)

Create a `/lib/commerce.ts` file, and within, copy the following to create a CommerceJS instance:

```ts
import CommerceSDK from '@chec/commerce.js'

const client = new CommerceSDK(process.env.NEXT_PUBLIC_CHEC_PUBLIC_API_KEY as string)

export default client
```

## Installing TailwindCSS

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest # Install dependencies
npx tailwindcss init -p # Create tailwind.config.js and postcss.config.js
```

Within `tailwind.config.js`, change the `purge` option so that tailwind can tree-shake unused styles in production builds

```
purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
```

Now, import Tailwind into `/pages/_app.tsx`

```ts
import 'tailwindcss/tailwind.css'
```

# Create Homepage for categories and products

```ts
import commerce from '../lib/commerce'

export async function getStaticProps() {
	const merchant = await commerce.merchants.about()
	const { data: categories } = await commerce.categories.list()
	const { data: products } = await commerce.products.list()

	return {
		props: {
			merchant, categories, products
		}
	}
}
```

From here, play with `merchant`, `categories` and `products` to display them how you like
