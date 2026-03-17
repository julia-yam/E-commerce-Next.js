import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface CheckoutItem {
  price: number;
  quantity: number;
  name?: string;
}

interface CheckoutRequestBody {
  items: CheckoutItem[];
}

export async function POST(req: Request) {
  try {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      return NextResponse.json(
        { error: "Ошибка конфигурации сервера: ключи не найдены" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as CheckoutRequestBody;
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
    }

    const totalUsd = items.reduce(
      (acc: number, item: CheckoutItem) => acc + item.price * item.quantity,
      0,
    );

    const exchangeRate = 92.5;
    const totalAmountInRub = (totalUsd * exchangeRate).toFixed(2);

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const authHeader = Buffer.from(
      `${shopId.trim()}:${secretKey.trim()}`,
    ).toString("base64");

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Idempotence-Key": uuidv4(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          value: totalAmountInRub,
          currency: "RUB",
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${origin}/cart-page?success=true`,
        },
        description: `Order for $${totalUsd.toFixed(2)} (Rate: ${exchangeRate})`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.description || "Ошибка ЮKassa" },
        { status: response.status },
      );
    }

    return NextResponse.json({ url: data.confirmation.confirmation_url });
  } catch (error: unknown) {
    let errorMessage = "Внутренняя ошибка";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Internal Server Error:", errorMessage);
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
