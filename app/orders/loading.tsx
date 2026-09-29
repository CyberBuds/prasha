import StorefrontPageLoading from '@/components/StorefrontPageLoading';

export default function Loading() {
  return (
    <StorefrontPageLoading
      page="orders"
      eyebrow="Order concierge"
      title="Your handloom journey, clearly followed."
      description="Look up an order with its number and checkout email, or review the latest order linked to your Prasha account."
    />
  );
}