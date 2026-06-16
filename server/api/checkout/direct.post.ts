import { z } from 'zod';

const bodySchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1),
});

const cartCreateMutation = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { code field message }
    }
  }
`;

export default defineEventHandler(async (event) => {
  const { variantId, quantity } = await readValidatedBody(event, bodySchema.parse);
  const storefront = useStorefront();
  const lines = [{ merchandiseId: variantId, quantity }];
  const response = await storefront.request(cartCreateMutation, { variables: { input: { lines } } });
  const result = response.data?.cartCreate;
  if (!result) throw createError({ statusCode: 500, statusMessage: 'Failed to create cart' });
  if (result.userErrors?.length) throw createError({ statusCode: 422, statusMessage: result.userErrors.map((e: { message: string }) => e.message).join(', ') });
  if (!result.cart?.checkoutUrl) throw createError({ statusCode: 500, statusMessage: 'No checkout URL returned' });
  return { checkoutId: result.cart.id as string, checkoutUrl: result.cart.checkoutUrl as string };
});
