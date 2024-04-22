import useAuth from "@/hooks/useAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import Image from "next/image";
import Head from "next/head";

const Order = ({ carts, clients, products }) => {
  const { isLoading, currentUser } = useAuth({
    middleware: "auth",
  });

  const [currentClient, setCurrentClient] = useState({});
  const [clientCarts, setClientCarts] = useState([]);
  const [cartsProds, setCartsProds] = useState([]);
  const [active, setActive] = useState(true);

  const getData = async () => {
    let prods = [];

    const currentClient = await clients.find(
      (el) => el.user === currentUser?.data?.user.id
    );
    setCurrentClient(currentClient);

    const clientCarts = carts.filter((el) => el.client === currentClient?.id);
    setClientCarts(clientCarts);

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < clientCarts.length; j++) {
        if (products[i].id === clientCarts[j].produit) {
          prods.push({
            product: products[i],
            cart: clientCarts[j],
          });
        }
      }
    }

    setCartsProds(prods);
  };

  useEffect(() => {
    getData();
  }, [currentUser, products, carts, clients]);

  return (
    <DashboardLayout>
      <Head>
        <title>Votre commandes</title>
      </Head>
      <h2>Vos commandes</h2>
      <div className="diviser"></div>
      <div className="order-content">
        <div className="top">
          <ul>
            <li
              onClick={() => setActive(true)}
              className={active ? "active" : ""}
            >
              Commandes en cours
            </li>
            <li
              onClick={() => setActive(false)}
              className={!active ? "active" : ""}
            >
              Historique des commandes
            </li>
          </ul>
        </div>{" "}
        {active ? (
          <div className="orders-container">
            <ul>
              {cartsProds
                .sort((a, b) => b.cart.id - a.cart.id)
                .map((prod) => (
                  <li key={prod.id}>
                    <div className="img">
                      <Image
                        src={prod.product.image}
                        alt={"image " + prod.product.nom_produit}
                        priority
                        width={100}
                        height={130}
                        loader={() => prod.product.image}
                      />
                    </div>
                    <div className="right">
                      <h3>{prod.product.nom_produit}</h3>
                      <div className="quanity">
                        <p className="title">quanité: {prod.cart.quantite}</p>
                      </div>
                      <div className="price">
                        <p className="title">prix total article:</p>
                        <p>
                          {prod.cart.prix_total_article.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="date">
                        <p className="title">commandé le : </p>
                        <p>
                          {prod.cart.date_commande
                            .split("-")
                            .reverse()
                            .join("-")}
                        </p>
                      </div>

                      <span>{"En cours"}</span>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div className="order-history">
            <h3>historique des commandes</h3>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Order;

//server side rendering

export const getStaticProps = async () => {
  const prodsRes = await axios.get("/produit");
  const cartsRes = await axios.get("/panier/panier/article/");
  const clientsRes = await axios.get("/client/");

  // console.log(carts);
  // console.log(clients);

  return {
    props: {
      products: prodsRes.data,
      carts: cartsRes.data,
      clients: clientsRes.data,
      // categoriesData,
    },
  };
};
