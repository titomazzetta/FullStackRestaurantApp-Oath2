'use strict';

const Stripe = require('stripe');
// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
  /**
   * Fetch all orders
   */
  async find(ctx) {
    try {
      // Query parameters for filtering, sorting, etc.
      const { params, query } = ctx;

      // Fetch orders using appropriate service method
      // @ts-ignore
      const orders = await strapi.query('order').find(params, query);

      ctx.send(orders);
    } catch (error) {
      strapi.log.error('Error fetching orders:', error);
      ctx.internalServerError('Internal server error');
    }
  },

  /**
   * Create a new order
   */
  async create(ctx) {
    try {
      const { user, total, address, dishes, token } = ctx.request.body;

      // Validate incoming data
      if (!user || !user.id || !user.email) {
        return ctx.badRequest('Missing or incomplete user information');
      }
      if (!total || !address || !dishes || !token) {
        return ctx.badRequest('Missing required order fields');
      }

      const stripeAmount = Math.floor(total * 100);

      // Create a charge using Stripe
      const charge = await stripe.charges.create({
        amount: stripeAmount,
        currency: 'usd',
        description: `Order on ${new Date()} by ${user.email}`,
        source: token,
      });

      if (charge) {
        // Create order in Strapi
        const strapiOrder = await strapi.entityService.create('api::order.order', {
          data: {
            user: user.id,
            total,
            address,
            dishes: dishes.map(dish => dish.id),
            paymentStatus: 'paid',
            email: user.email,
          },
        });

        ctx.send({ message: 'Order processed successfully', order: strapiOrder });
      } else {
        ctx.badRequest('Payment failed');
      }
    } catch (error) {
      strapi.log.error('Order creation error:', error);
      ctx.internalServerError('Internal server error');
    }
  },

  /**
   * Fetch a single order by ID
   */
  async findOne(ctx) {
    try {
      const { params } = ctx;

      // Fetch order using appropriate service method
      // @ts-ignore
      const order = await strapi.query('order').findOne(params);

      if (!order) {
        return ctx.notFound('Order not found');
      }

      ctx.send(order);
    } catch (error) {
      strapi.log.error('Error fetching order:', error);
      ctx.internalServerError('Internal server error');
    }
  },

  // Add other methods as needed: update, delete, etc.
};
