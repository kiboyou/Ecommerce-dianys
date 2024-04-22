import "@/styles/index.scss";
import "@mantine/core/styles.css";
import { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { CartProvider } from "react-use-cart";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";
// import "../globals.css";

export default function App({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  const { refresh, currentUser } = useAuth();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        if (currentUser) {
          await refresh();
        }
      } catch (error) {
        console.error(
          "Erreur lors du rafraîchissement du jeton :",
          error
        );
      }
    };

    // Mettre en place un intervalle pour rafraîchir toutes les 7 minutes
    const refreshInterval = setInterval(async () => {
      checkAuthentication();
    }, 1000 * 60 * 7);

    // Déclencher une vérification initiale lorsque le composant est monté
    checkAuthentication();

    // Nettoyer l'intervalle lorsque le composant est démonté
    setMounted(true);
    return () => clearInterval(refreshInterval);
  }, [currentUser, refresh]);

  if (!mounted) {
    return (
      <MantineProvider
        // withGlobalStyles
        // withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light",
        }}
      >
        <>
          {/* <Provider store={store}> */}
          <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />;{/* </Provider> */}
        </>
      </MantineProvider>
    );
  }
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
    >
      <CartProvider>
        <ModalsProvider>
          <Notifications />

          <>
            {/* <Provider store={store}> */}
            <Head>
              <link
                rel="shortcut icon"
                href="/favicon.ico"
              />
            </Head>
            <Component {...pageProps} />
            {/* </Provider> */}
          </>
        </ModalsProvider>
      </CartProvider>
    </MantineProvider>
  );
}
