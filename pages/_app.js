import React from 'react';
import Layout from "@/components/Layout";
import "@/styles/globals.css";
import { CartProvider } from "use-shopping-cart";
import { useState } from 'react';
import QAIntro from "@/components/PrdAndSequence";
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const [showQAIntro, setShowQAIntro] = useState(true);
  const router = useRouter();

  const handleProceed = () => {
    setShowQAIntro(false);
  };

  // Skip QA intro for test-runner page
  const shouldShowIntro = showQAIntro && router.pathname !== '/test-runner';

  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      successUrl={`${process.env.NEXT_PUBLIC_URL}/success`}
      cancelUrl={`${process.env.NEXT_PUBLIC_URL}/?success=false`}
      currency="JPY"
      allowedCountries={["JP"]}
      shouldPersist={true}
    >
      <Layout>
        {shouldShowIntro ? (
          <QAIntro onProceed={handleProceed} />
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </CartProvider>
  );
}