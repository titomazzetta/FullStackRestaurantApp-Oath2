'use strict';

const Stripe = require('stripe');

const { createCoreController } = require('@strapi/strapi').factories;

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      // @ts-ignore
      const { user, total, address, dishes, token } = ctx.request.body;

      // Convert total to cents as Stripe expects the amount to be in the smallest currency unit
      const stripeAmount = Math.floor(total * 100);

      // Create a charge using Stripe
      const charge = await stripe.charges.create({
        amount: stripeAmount,
        currency: 'usd',
        description: `Order ${new Date()} by ${user.username}`,
        source: token,
      });

      if (charge) {
        // Payment successful, create order in Strapi
        const strapiOrder = await strapi.entityService.create('api::order.order', {
          data: {
            user: user.id,
            total,
            address,
            dishes: dishes.map(dish => dish.id),
            paymentStatus: 'paid',
          },
        });

        ctx.send({ message: 'Order processed successfully', order: strapiOrder });
      } else {
        ctx.send({ message: 'Payment failed' }, 400);
      }
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  // You can add other methods (find, findOne, etc.) here as needed
}));
