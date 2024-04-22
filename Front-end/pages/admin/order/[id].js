import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import useSWR from "swr";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Image from "next/image";
import { Button } from "@mantine/core";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Order = ({ order }) => {
  // console.log(order);

  const { currentUser, isLoading } = useAuth({});
  const router = useRouter();
  useEffect(() => {
    // If the user is not a superuser, redirect them to the login page
    if (
      !isLoading &&
      (!currentUser ||
        !currentUser.data ||
        currentUser.data.length === 0 ||
        !currentUser.data.user?.is_superuser)
    ) {
      router.push("/login");
    }
  }, [currentUser, isLoading]);

  const [articles, setArticles] = useState([]);
  const [prods, setProds] = useState([]);

  const {
    data: cart,
    error,
    mutate,
    isLoading: cartLoading,
  } = useSWR(`/panier/${order.panier}`, () =>
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/panier/${order.panier}/`,
      fetcher
    )
  );

  // fetch cart artciles
  const fetchCarts = async () => {
    let cartArticles = [];

    if (cart?.data) {
      for (let i = 0; i < cart?.data?.article.length; i++) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/panier/panier/article/${cart?.data?.article[i]}`,
          fetcher
        );
        cartArticles.push(res.data);
        localStorage.setItem("cartArticles", JSON.stringify(cartArticles));
      }
    }

    // setArticles(cartArticles);
  };

  const getAricles = async () => {
    const articles = localStorage.getItem("cartArticles");

    return articles ? JSON.parse(articles) : [];
  };

  // fetch cart prods
  const fetchOrderProds = async () => {
    let prods = [];

    const articles = await getAricles();
    setArticles(articles);

    // console.log(articles);
    if (articles.length > 0) {
      for (let i = 0; i < articles.length; i++) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/${articles[i].produit}/`
          );

          const size = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/pointure/${articles[i].pointure}/`
          );

          prods.push({
            article: res.data,
            size: size.data.taille,
            quantity: articles[i].quantite,
          });

          console.log(size);
        } catch (error) {
          console.log(error);
        }
      }
      setProds(prods);
    }
  };

  //change status
  const changeOrderStatus = async () => {
    try {
      const formData = new FormData();
      formData.append("num_commande", order.num_commande);
      formData.append("mode_livraison", "livraison");
      formData.append("date_livraison", order.date_livraison);
      formData.append("adresse_livraison", order.adresse_livraison);
      formData.append("prix_livraison", 0);
      formData.append("prix_commande", order.prix_commande);
      formData.append("date_commander", order.date_commander);
      formData.append("etat_commande	", false);
      formData.append("panier", order.panier);

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/commande/${order.id}/`,
        formData
      );

      console.log(res);
      toast.success("Statut de la commande changé !");
    } catch (error) {
      console.log("error to modif order" + error);
      toast.error("Une erreur est survenue !");
    }
  };

  // fetchOrderProds();
  useEffect(() => {
    fetchCarts();
    fetchOrderProds();
    console.log("ok");
  }, [order.id, cart?.data]);

  // console.log(cart);

  const dateFornater = () => {
    dayjs.locale("fr");
    const date = dayjs(order.date_commander).format("dddd D MMM YYYY");

    return date;
  };

  return (
    <div className="order">
      <Toaster richColors position="top-right" />
      <div className="content">
        <div className="top">
          <Link href="/admin/order" style={{ color: "#202020" }}>
            <div className="back">
              <span className="icon">
                <IoIosArrowBack />
              </span>
              <p>Retour</p>
            </div>
          </Link>
          <h2>Détails de la commande</h2>
          <div className="diviser"></div>
        </div>

        <div className="details">
          <div className="action">
            <h3>ID commande {order.num_commande}</h3>
            <Button onClick={changeOrderStatus}>Changer statut</Button>
          </div>
          <h4>nombres d&apos;articles : {cart?.data?.article.length}</h4>
          <h4>Effectué le : {dateFornater()}</h4>
          <h4>Total : {order.prix_commande.toLocaleString()} FCFA</h4>
        </div>
        <div className="diviser"></div>

        <div className="articles">
          <h3 className="title">ARTICLES DE LA COMMANDE</h3>
          <div className="diviser"></div>

          <ul>
            {prods.map((prod) => (
              <li key={prod.id}>
                <div className="img">
                  <Image
                    src={prod.article.image}
                    alt={"image de " + prod.article.nom_produit}
                    height={130}
                    width={100}
                    loader={() => `${prod.article.image}`}
                  />
                </div>
                <div className="infos">
                  <h3>{prod.article.nom_produit}</h3>
                  <h5 className="size">
                    Taille : <span>{prod.size}</span>
                  </h5>
                  <h5 className="quantity">
                    Quantité : <span>{prod.quantity}</span>
                  </h5>
                  <p className="price">
                    {prod.article.prix.toLocaleString()} FCFA
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="livraison">
          <h3 className="title">INFORMATIONS DE LIVRAISONS</h3>
          <h3>Mode de paiement</h3>
          <h4>{order.mode_livraison}</h4>
          <h3>Adresse de livraison</h3>
          <h4>
            {order.adresse_livraison.split(",")[0]}{" "}
            {order.adresse_livraison.split(",")[1]}
          </h4>
          <h4>{order.adresse_livraison.split(",")[3]}</h4>
          <h4>{order.adresse_livraison.split(",")[4]}</h4>
          <h4>{order.adresse_livraison.split(",")[2]}</h4>
        </div>
      </div>
    </div>
  );
};

export default Order;

export const getStaticProps = async (context) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/commande/${context.params.id}`
  );

  const order = res.data;
  // console.log(order);J

  return {
    props: {
      order,
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/commande`);

  const orders = await res.json();

  const ids = orders.map((order) => order.id);

  const paths = ids.map((id) => ({ params: { id: id.toString() } }));

  return {
    paths,
    fallback: false,
  };
};
