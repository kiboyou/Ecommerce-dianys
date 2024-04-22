import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import RecapCard from "@/components/RecapCard";
import { Button } from "@mantine/core";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "react-use-cart";
import { FaWhatsapp } from "react-icons/fa";

const Cart = () => {
  const { isEmpty, items, cartTotal, totalItems } = useCart();

  const handleWhatsAppCart = () => {
    if (items.length > 0) {
      const cartText = items.map((item) => {
        const productLink = `https://dianys-boutique.com/produit/${item.id}`;
        return `Produit: ${item.nom_produit}%0AQuantité: ${
          item.quantity
        }%0APrix: ${item.price.toLocaleString()} FCFA%0AMontant total: ${item.itemTotal.toLocaleString()} FCFA%0A${productLink}`;
      });

      cartText.push(
        `%0A%0AMontant total de la commande: ${cartTotal.toLocaleString()} FCFA`
      );

      const cartLink = cartText.join("%0A%0A");

      const phoneNumber = "2250544450567";

      try {
        const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Bonjour%20J'aimerais%20passer%20une%20commande%0A%0A${cartLink}`;

        window.open(whatsappLink, "_blank");
      } catch (error) {
        console.error("Erreur lors de la redirection vers WhatsApp", error);
      }
    } else {
      console.error("Le panier est vide.");
    }
  };

  if (isEmpty) {
    return (
      <div className="empty-cart">
        <Head>
          <title>Votre panier</title>
        </Head>
        <header>
          <Nav />
        </header>
        <div className="empty-content">
          <div className="img">
            <Image
              src="/assets/img/empty-cart.jpg"
              width={300}
              priority
              height={350}
              alt="empty cart"
            />
          </div>
          <h4>Votre panier est vide !</h4>
          <p>il semble que vous n&apos;ayez rien ajouté dans votre panier.</p>
        </div>
        <Link href="/products">
          <Button className="empty-btn">Commencez vos Achats</Button>
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Head>
        <title>Votre panier</title>
      </Head>
      <header>
        <Nav />
      </header>
      <div className="cart-container">
        <div className="top">
          <h3 className="cart-title">Panier ({totalItems})</h3>
        </div>
        <section>
          <ul>
            {items.map((prod) => (
              <RecapCard key={prod.id} prod={prod} />
            ))}
          </ul>
          <div className="left">
            <div className="summary">
              <h3 className="summary-title">Resumé du panier</h3>
              <div className="total">
                <p>Prix Total </p>
                <span>{cartTotal.toLocaleString()} FCFA</span>
              </div>
              <div className="total-price">
                {cartTotal.toLocaleString()} FCFA
              </div>
            </div>
            <div className="btn-container">
              <Button
                className="order-button what-btn"
                onClick={handleWhatsAppCart}
              >
                <FaWhatsapp size={"1.5rem"} />
                Commander sur whatsapp
              </Button>
              <Link href={"/checkout"}>
                <Button className="order-button">COMMANDER</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
