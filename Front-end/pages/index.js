import React, { useEffect, useState } from "react";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Main from "../components/Main";
import Nav from "../components/Nav";
import useAuth from "@/hooks/useAuth";
import axios from "@/lib/axios";
import Card from "@/components/Card";
import { Button } from "@mantine/core";
import Link from "next/link";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = ({ prodData }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoading, logout, currentUser } = useAuth({
    middleware: "guest",
  });

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (typeof prodData !== "undefined") {
      let updatedProducts = [];
      for (let i = 0; i < prodData?.length; i++) {
        updatedProducts.push({
          archiver: prodData[i].archiver,
          categorie: prodData[i].categorie,
          couleurs: prodData[i].couleurs,
          date_creation: prodData[i].date_creation,
          date_modification: prodData[i].date_modification,
          description: prodData[i].description,
          disponible: prodData[i].disponible,
          id: prodData[i].id,
          image: prodData[i].image,
          nom_produit: prodData[i].nom_produit,
          price: prodData[i].prix,
          solder: prodData[i].solder,
          sous_categorie: prodData[i].sous_categorie,
          tailles: prodData[i].tailles,
          taux_pourcentage: prodData[i].taux_pourcentage,
        });
      }

      // Mettre à jour l'état "products" avec les nouvelles données
      setProducts(updatedProducts);
      setLoading(false);
    }
  }, [prodData]);

  return (
    <div className="home">
      <Head>
        <title>
          Dianys Boutique - La mode féminine de qualité.
          Vêtements, Chaussures et Accessoires.
        </title>
        <meta
          name="description"
          content="Bienvenue chez Diany's Boutique. Parcourez notre collection exquise de vêtements tendance, de chaussures élégantes 
          et d'accessoires raffinés, soigneusement sélectionnés pour sublimer la beauté de chaque femme."
        />
      </Head>
      <header>
        <Nav
          currentUser={currentUser}
          logout={logout}
          isLoading={isLoading}
        />
        <Main />
      </header>
      <Categories />
      <div
        className="home-section"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <h2>Découvrez les produits récents</h2>
        <h4>
          Explorez les dernières tendances de la mode
          féminine avec notre collection de produits
          récents, soigneusement sélectionnés pour vous
        </h4>
        <div className="news-content">
          {products
            .sort((a, b) => b.id - a.id)
            .slice(0, 6)
            .map((prod) => (
              <Card
                key={prod.id}
                prod={prod}
                loading={loading}
              />
            ))}
        </div>
        <Link href={"/news"}>
          <Button>Voir tous les produit</Button>
        </Link>
      </div>
      <div
        className="home-section solde"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <h2>Produits en solde</h2>
        <h4>
          Économisez tout en restant stylée ! Découvrez nos
          produits en solde
        </h4>
        <div className="news-content">
          {products
            .sort((a, b) => b.id - a.id)
            .filter((prod) => prod.solder === true)
            .slice(0, 6)
            .map((prod) => (
              <Card
                key={prod.id}
                prod={prod}
                loading={loading}
              />
            ))}
        </div>
        <Link href={"/solde"}>
          <Button>Voir tous les produits</Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

//ssr fetch
export const getStaticProps = async () => {
  const res = await axios.get("/produit");
  const prodData = res.data;

  return {
    props: {
      prodData,
    },
  };
};
