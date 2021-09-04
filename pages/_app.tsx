// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import { CartProvider } from '../context/cart'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-image-lightbox/style.css';
import 'tailwindcss/tailwind.css'
import '../styles/algolia-overrides.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_API_KEY as string);

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Elements stripe={stripePromise}>
			<CartProvider>
				<Component {...pageProps} />
			</CartProvider>
		</Elements>
	)
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp