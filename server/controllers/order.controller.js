import stripe from "../middleware/stripe.js";
import dataSource from "../db/db.js";
import cart from "../entities/cart.js";

const orderRepo = dataSource.getRepository("Order");
const orderItemRepo = dataSource.getRepository("OrderItem");
const productRepo = dataSource.getRepository("Product");
const userRepo = dataSource.getRepository("User");

export const createCheckoutSession = async (req, res) => {
  try {
    const cartItems = req.body;
    const userId = req.userId;

    console.log("Cart Items:", cartItems);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const productsFromDb = [];
    for (const item of cartItems) {
      const product = await productRepo.findOne({
        where: { id: item.product.id },
      });
      if (!product) console.log(`Product with ID ${item.product.id} not found`);
      productsFromDb.push({ db: product, cart: item.quantity });
    }
    console.log(productsFromDb);

    const lineItems = productsFromDb.map(({ db, cart }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: db.title,
        },
        unit_amount: db.price * 100,
      },
      quantity: cart,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/`,
      cancel_url: `https://mywebsite.com/payment-cancel`,
      metadata: {
        userId,
        cart: JSON.stringify(
          cartItems.map((item) => ({
            id: item.product.id,
            price: item.product.price,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const cartItems = JSON.parse(session.metadata.cart);
    const paymentId = session.payment_intent;

    try {
      let totalAmount = 0;
      for (const item of cartItems) {
        const product = await productRepo.findOne({ where: { id: item.id } });
        totalAmount += product.price * item.quantity;
      }

      const order = orderRepo.create({
        amount: totalAmount.toString(),
        status: "paid",
        payment_id: paymentId,
        user: { id: userId },
      });
      const savedOrder = await orderRepo.save(order);

      for (const item of cartItems) {
        const product = await productRepo.findOne({ where: { id: item.id } });

        const orderItem = orderItemRepo.create({
          price: product.price,
          quantity: item.quantity,
          product,
          order: savedOrder,
        });

        await orderItemRepo.save(orderItem);
      }

      console.log(`Order & OrderItems created for user=${userId}`);
    } catch (err) {
      console.log("Failed to create order or order items:", err);
    }
  }

  return res.json({ message: "successfully processed webhook" });
};
