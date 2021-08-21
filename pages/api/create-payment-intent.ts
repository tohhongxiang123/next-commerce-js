import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY as string)
export default async function handleCreatePaymentIntent(req: NextApiRequest, res: NextApiResponse) {
    const { items } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd"
    });

    console.log(paymentIntent)
    res.json({
        clientSecret: paymentIntent.client_secret
    });
}

function calculateOrderAmount(items: any) {
    let total = 0

    items.forEach((item: any) => total += item.line_total.raw)
    return Math.round(total * 100);
}