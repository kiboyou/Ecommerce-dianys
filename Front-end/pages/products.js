import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Nav from "../components/Nav";
import axios from "@/lib/axios";
import { Center, Pagination } from "@mantine/core";
import Footer from "@/components/Footer";

import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";

const Products = ({
  prodData,
  prodColors,
  categoriesData,
}) => {
  const [products, setProducts] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState([]);
  const [search, setSearch] = useState("");
  const [productsFilter, setProductsFilter] =
    useState("Tout");

  const filtre = [
    "Tout",
    "Escarpin",
    "Mules",
    "Compensées",
    "Nu-pieds",
  ];

  useEffect(() => {
    if (typeof prodData !== "undefined") {
      let updatedProducts = [];

      for (let i = 0; i < prodData?.length; i++) {
        if (
          prodColors.some(
            (color) =>
              color.produit === prodData[i].id &&
              color.nom === "main"
          )
        ) {
          updatedProducts.push({
            archiver: prodData[i].archiver,
            categorie: prodData[i].categorie,
            couleurs: prodData[i].couleurs,
            date_creation: prodData[i].date_creation,
            date_modification:
              prodData[i].date_modification,
            description: prodData[i].description,
            disponible: prodData[i].disponible,
            id: prodData[i].id,
            main: true,
            image: prodData[i].image,
            nom_produit: prodData[i].nom_produit,
            price: prodData[i].prix,
            solder: prodData[i].solder,
            sous_categorie: prodData[i].sous_categorie,
            tailles: prodData[i].tailles,
            taux_pourcentage: prodData[i].taux_pourcentage,
          });
        }
        // }
      }

      setProducts(updatedProducts);
    }
  }, [prodData, prodColors]);

  const getCurrentFilter = () => {
    if (productsFilter === "Compensées") {
      return "compensees";
    } else if (productsFilter === "Nu-pieds") {
      return "nu-pieds";
    }

    return productsFilter;
  };

  const filterData = () => {
    let tempProd = [];

    if (getCurrentFilter() === "Tout") {
      // console.log(tempProd);
      return products;
    } else {
      const categoryId = categoriesData.find(
        (category) =>
          category.nom_sous_categorie.toLowerCase() ===
          getCurrentFilter().toLowerCase()
      )?.id;

      if (categoryId) {
        tempProd = products.filter(
          (prod) => prod.sous_categorie === categoryId
        );
      }

      return tempProd;
    }
  };

  //pagination
  const itemsPerPage = 8;

  const totalPage = Math.ceil(
    filterData().length / itemsPerPage
  );
  const [activePage, setPage] = useState(1);

  const sortedData = [...filterData()].sort(
    (a, b) =>
      new Date(b.date_creation) - new Date(a.date_creation)
  );

  const currentData = sortedData.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  // Now tempProd contains the filtered products based on the selected category or subcategory

  return (
    <div className="products">
      <Head>
        <title>Nos produits</title>
        <meta
          name="description"
          content="Découvrez la collection de produits de qualité chez Diany's Boutique. 
          Parcourez notre sélection soigneusement choisie de vêtements élégants, de chaussures tendance et d'accessoires raffinés, 
          conçus pour mettre en valeur la beauté unique de chaque femme."
        />
      </Head>
      <header>
        <Nav />
      </header>

      <div className="products-container">
        <div className="left">
          <h2>Produits</h2>
          <ul>
            {filtre.map((el) => (
              <li key={el}>
                <input
                  type="radio"
                  name="filte-el"
                  id={el}
                  defaultChecked={el === productsFilter}
                />
                <label
                  htmlFor={el}
                  onClick={() => {
                    setProductsFilter(el);
                  }}
                >
                  {el}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="right">
          <ul>
            {currentData
              .sort((a, b) => {})
              .map((prod) => (
                <Card key={prod.id} prod={prod} />
              ))}
          </ul>
        </div>
      </div>
      <Center
        style={{ marginBottom: "50px", marginTop: "30px" }}
      >
        <Pagination
          total={totalPage}
          color="#202020"
          onChange={setPage}
          value={activePage}
          // style={{color: 'black'}}
        />
      </Center>
      <Footer />
    </div>
  );
};

export default Products;

//server side rendering

export const getStaticProps = async () => {
  const res = await axios.get("/produit");
  const colors = await axios.get(
    "/produit/produit/couleur"
  );
  const categories = await axios.get(
    "/categorie/categorie/sous-categorie/"
  );

  const prodData = res.data;
  const prodColors = colors.data;
  const categoriesData = categories.data;

  return {
    props: {
      prodData,
      prodColors,
      categoriesData,
    },
  };
};
