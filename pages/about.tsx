import React from 'react'
import { Layout } from '../components'
import Image from 'next/image'
import commerce from '../lib/commerce'
import { Merchant } from '@chec/commerce.js/types/merchant'

interface AboutProps {
	merchant: any,
}

const MERCHANT_IMAGE_HEIGHT = 256
export default function About({ merchant }: AboutProps) {
    return (
        <Layout title="About">
            <div className="p-8">
                <h1>{merchant.name}</h1>
                <div dangerouslySetInnerHTML={{ __html: merchant.description }} />
                <Image src={merchant.images.logo.url} alt={`${merchant.name}'s logo`} height={MERCHANT_IMAGE_HEIGHT} width={MERCHANT_IMAGE_HEIGHT / merchant.images.logo.image_dimensions.height * merchant.images.logo.image_dimensions.width} />
            </div>
        </Layout>
    )
}

export async function getStaticProps() {
	const { data: merchants } = await commerce.merchants.about() as any
	const merchant: Merchant = merchants[0]

	return {
		props: {
			merchant
		}
	}
}
