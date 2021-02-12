const stripe = require("stripe")(
  "sk_test_51IJkKuDQeoCMmQCsOEVc3pKlixmAjYaGjwgcTTD1jxY4ARcRLZMs9Y9M0gGzROMPN1eav8frefYUJDb3iBrrjZzW00jB1uPRR8"
);
const { v4: uuidv4 } = require("uuid");

exports.makePayment = (req, res) => {
  const { products, token } = req.body;

  let amount = 0;
  products.map((prod) => {
    amount = amount + prod.price;
  });

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token._id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "Test Account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => res.status(200).json(result));
    })
    .catch((err) => console.log(err));
};
