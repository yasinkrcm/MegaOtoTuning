import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { items } = await request.json();

    // Test sepet verisi
    const testItems = items || [
      {
        productName: "Test Ürün 1",
        price: 18.50,
        quantity: 2
      },
      {
        productName: "Test Ürün 2", 
        price: 25.00,
        quantity: 1
      }
    ];

    // PayTR formatına uygun sepet hazırla
    const basketArray = testItems.map(item => [
      item.productName,
      (item.price * 100).toString(), // Kuruş cinsinden fiyat
      item.quantity.toString()
    ]);

    const user_basket = Buffer.from(JSON.stringify(basketArray)).toString('base64');

    // Debug bilgileri
    const debugInfo = {
      originalItems: testItems,
      basketArray: basketArray,
      user_basket: user_basket,
      decodedBasket: JSON.parse(Buffer.from(user_basket, 'base64').toString()),
      totalAmount: testItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    return NextResponse.json({
      status: 'success',
      debugInfo,
      message: 'user_basket formatı hazırlandı'
    });

  } catch (error) {
    console.error('Debug hatası:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
