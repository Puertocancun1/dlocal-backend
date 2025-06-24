export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { amount, currency, country, payer, order_id, payment_method_id } = req.body;

  try {
    const response = await fetch("https://sandbox.dlocal.com/secure/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-login": process.env.DLOCAL_LOGIN,
        "x-trans-key": process.env.DLOCAL_TRANS_KEY,
      },
      body: JSON.stringify({
        amount,
        currency,
        country,
        payer,
        order_id,
        payment_method_id,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
