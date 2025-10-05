"use client";

import { useState } from "react";

export default function PaymentStatusToggle({ orderId, initialIsPaid }) {
  const [isPaid, setIsPaid] = useState(initialIsPaid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
      });
      if (!res.ok) throw new Error("Güncelleme başarısız");
      setIsPaid(!isPaid);
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
        {isPaid ? "Ödendi" : "Bekliyor"}
      </span>
    </div>
  );
} 