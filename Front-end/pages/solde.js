import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import Nav from "../components/Nav";
import axios from "@/lib/axios";
import { Center, Pagination } from "@mantine/core";
import Footer from "@/components/Footer";
import { useDisclosure } from "@mantine/hooks";
import SalesBanner from "@/components/SalesBanner";
import Head from "next/head";

const Solde = ({
  prodData,
  categoriesData,
  prodColors,
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
      return products.filter(
        (prod) => prod.solder === true
      );
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

      return tempProd.filter(
        (prod) => prod.solder === true
      );
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

  console.log(search);

  return (
    <div className="products">
      <Head>
        <title>
          Soldes | decoucrez nos produits en soldes
        </title>
        <meta
          name="description"
          content="Profitez de réductions exceptionnelles sur notre collection de vêtements à la mode, de chaussures élégantes et d'accessoires tendance. 
          Ne manquez pas l'occasion de mettre à jour votre garde-robe avec des pièces de qualité à des prix irrésistibles."
        />
      </Head>
      <header>
        <Nav />
      </header>

      {/* <SalesBanner /> */}

      <div className="products-container">
        <div className="left">
          <h2 className="sales-title">Produits en solde</h2>
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
              .sort((a, b) => b.id - a.id)
              .map((prod) => (
                <Card key={prod.id} prod={prod} />
              ))}
          </ul>
        </div>
      </div>
      <Center
        style={{ marginBottom: "50px", marginTop: "15px" }}
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

export default Solde;

//server side rendering

export const getStaticProps = async () => {
  const res = await axios.get("/produit");
  const categories = await axios.get(
    "/categorie/categorie/sous-categorie/"
  );
  const colors = await axios.get(
    "/produit/produit/couleur"
  );

  const prodData = res.data;
  const categoriesData = categories.data;
  const prodColors = colors.data;

  return {
    props: {
      prodData,
      categoriesData,
      prodColors,
    },
  };
};
