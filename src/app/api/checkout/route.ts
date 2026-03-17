import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
});

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body as { items: CheckoutItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
    }

    const lineItems = items.map((item: CheckoutItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/cart-page?success=true`,
      cancel_url: `${origin}/cart-page`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Ошибка Stripe:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Что-то пошло не так";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
