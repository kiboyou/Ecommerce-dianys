import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Button, Center, Pagination, Transition } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Head from "next/head";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CategoriesLayout = ({ children }) => {
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const [showSort, setShowSort] = useState(false);
  const ref = useClickOutside(() => setShowSort(false));
  const [selectedSortOption, setSelectedSortOption] = useState("dateRecent");

  const path = router.pathname.split("/");
  const categorie = path.slice(-1);

  //   console.log(path);

  const title = () => {
    if (categorie.includes("vetements")) {
      return "Vêtements";
    } else if (categorie.includes("echarpes")) {
      return "Echapes / Foulards";
    } else if (categorie.includes("sac")) {
      return "Sac à main";
    } else if (categorie.includes("compensees")) {
      return ["compensees"];
    } else if (categorie.includes("nu-pieds")) {
      return ["nu-pieds"];
    } else {
      return categorie;
    }
  };

  const h2 = () => {
    if (title()[0] === "compensees") {
      return "Compensées";
    } else if (title()[0] === "nu-pieds") {
      return "Nu-pieds";
    } else {
      return title(0)[0];
    }
  };

  const metaData = () => {
    if (categorie.includes("vetements")) {
      const headTitle = "Vêtements femmes";
      const metaContent =
        "Découvrez la catégorie Vêtements chez Diany's Boutique. Explorez notre sélection de vêtements tendance pour femmes";

      return [headTitle, metaContent];
    } else if (categorie.includes("chaussures")) {
      const headTitle =
        "Chaussures femmes - Découvrez les meilleurs chaussures en cuir véritable chez Diany's Boutique";
      const metaContent =
        "Découvrez la catégorie chaussures chez Diany's Boutique. Explorez notre sélection de chaussures tendance pour femmes, comprenant des sandales, des talons, des mules , des compensées et bien plus encore. Trouvez les chaussures parfaites pour chaque occasion et achetez en ligne dès maintenant.";

      return [headTitle, metaContent];
    } else if (categorie.includes("nu-pieds")) {
      const headTitle =
        "Nu-Pieds - Parcourez notre collection de Nu-pieds tendance chez Diany's Boutique";
      const metaContent =
        "Découvrez les nu-pieds de chez Diany's Boutique. Explorez notre sélection de nu-pieds tendance, des modèles décontractés aux styles élégants et en cuir véritable.";

      return [headTitle, metaContent];
    } else if (categorie.includes("compensees")) {
      const headTitle = "Compensées";
      const metaContent =
        "Explorez notre sélection de compensées en cuir ches diany's boutique";

      return [headTitle, metaContent];
    } else if (categorie.includes("mules")) {
      const headTitle = "Mules";
      const metaContent =
        "Explorez notre sélection de mules en cuir ches diany's boutique";

      return [headTitle, metaContent];
    } else if (categorie.includes("escarpin")) {
      const headTitle = "Escarpin";
      const metaContent =
        "Explorez notre sélection d'escarpin en  cuir ches diany's boutique";

      return [headTitle, metaContent];
    } else if (categorie.includes("accessoires")) {
      const headTitle =
        "Accessoires femmes - Découvrez les meilleurs accessoires de la mode féminine chez Diany's Boutique";
      const metaContent =
        "Découvrez la catégorie accessoires chez Diany's Boutique. Explorez notre sélection d'accessoires tendance pour femmes, comprenant des echapes , des foulards, des talons, des Sac à main , et turban. Trouvez les accessoires parfaits pour chaque occasion et achetez en ligne dès maintenant.";

      return [headTitle, metaContent];
    } else if (categorie.includes("sac")) {
      const headTitle = "Sac á main";
      const metaContent =
        "Explorez notre sélection de sac á mains tendances ches diany's boutique";

      return [headTitle, metaContent];
    } else if (categorie.includes("echarpes")) {
      const headTitle = "Echapes / Foulards";
      const metaContent =
        "Explorez notre sélection d'écharpes et de foulards tendances ches diany's boutique";

      return [headTitle, metaContent];
    } else if (categorie.includes("turban")) {
      const headTitle = "Turban";
      const metaContent =
        "Explorez notre sélection de turban tendances ches diany's boutique";

      return [headTitle, metaContent];
    }
  };

  //data fetching
  const {
    data: prodData,
    error,
    mutate,
  } = useSWR(`/produit`, () =>
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit`)
  );

  const { data: prodColors, error: colorError } = useSWR(
    `/produit/produit/couleur`,
    () =>
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/couleur/`
      )
  );

  const { data: prodCategories, error: CategoriesError } = useSWR(
    `/categorie`,
    () => axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/`)
  );

  const { data: prodSubCategories, error: SubCategoriesError } = useSWR(
    `/categorie/categorie/sous-categorie`,
    () =>
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/categorie/sous-categorie/`
      )
  );

  const filterData = () => {
    let tempProd = [];

    if (path.length === 3) {
      const categoryId = prodCategories?.data?.find(
        (category) =>
          category.nom_categorie.toLowerCase() === title()[0].toLowerCase()
      )?.id;

      if (categoryId) {
        tempProd = products.filter((prod) => prod.categorie === categoryId);
      }
    } else if (path.length === 4) {
      const subcategoryId = prodSubCategories?.data?.find(
        (subcategory) =>
          subcategory.nom_sous_categorie.toLowerCase() ===
          title()[0].toLowerCase()
      )?.id;

      if (subcategoryId) {
        tempProd = products.filter(
          (prod) => prod.sous_categorie === subcategoryId
        );
      }
    }

    // Now tempProd contains the filtered products based on the selected category or subcategory
    return tempProd;
  };

  // Sorting logic
  const sortOptions = {
    dateRecent: (a, b) => b.id - a.id,
    dateOld: (a, b) => new Date(a.date_creation) - new Date(b.date_creation),
    priceHigh: (a, b) => b.price - a.price,
    priceLow: (a, b) => a.price - b.price,
  };

  const sortedProducts = filterData().sort(sortOptions[selectedSortOption]);

  //pagination
  const itemsPerPage = 8;

  const totalPage = Math.ceil(sortedProducts.length / itemsPerPage);
  const [activePage, setPage] = useState(1);

  const currentData = sortedProducts.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  //   console.log(products);

  useEffect(() => {
    if (typeof prodData !== "undefined" && typeof prodColors !== "undefined") {
      let updatedProducts = [];

      for (let i = 0; i < prodData.data?.length; i++) {
        if (
          prodColors.data.some(
            (color) =>
              color.produit === prodData.data[i].id && color.nom === "main"
          )
        ) {
          updatedProducts.push({
            archiver: prodData.data[i].archiver,
            categorie: prodData.data[i].categorie,
            couleurs: prodData.data[i].couleurs,
            date_creation: prodData.data[i].date_creation,
            date_modification: prodData.data[i].date_modification,
            description: prodData.data[i].description.data,
            disponible: prodData.data[i].disponible,
            id: prodData.data[i].id,
            main: true,
            image: prodData.data[i].image,
            nom_produit: prodData.data[i].nom_produit,
            price: prodData.data[i].prix,
            solder: prodData.data[i].solder,
            sous_categorie: prodData.data[i].sous_categorie,
            tailles: prodData.data[i].tailles,
            taux_pourcentage: prodData.data[i].taux_pourcentage,
          });
        }
        // }
      }

      setProducts(updatedProducts);
    }
  }, [prodColors, prodData]);

  //   console.log(products);

  return (
    <div className="categories-pages">
      <Head>
        <title>{metaData()[0]}</title>
        <meta name="description" content={metaData()[1]} />
      </Head>
      <header>
        <Nav />
      </header>
      <div className="categories-content">
        <h2>{h2()}</h2>
        <div className="sort">
          <Button radius={5} onClick={() => setShowSort(true)} ref={ref}>
            <span>Trier</span>
            <div className="icon">
              <MdKeyboardArrowDown size={"1.3rem"} />
            </div>
          </Button>{" "}
          {showSort && (
            <Transition
              mounted={showSort}
              transition="scale"
              duration={500}
              timingFunction="ease"
            >
              {(styles) => (
                <div className="sort-container" style={styles} ref={ref}>
                  <h3>Trier par</h3>
                  <div className="diviser"></div>

                  <ul>
                    <li
                      onClick={() => setSelectedSortOption("dateRecent")}
                      className={
                        selectedSortOption === "dateRecent" ? "active" : ""
                      }
                    >
                      <span>Date: </span>plus récent
                    </li>
                    <li
                      onClick={() => setSelectedSortOption("dateOld")}
                      className={
                        selectedSortOption === "dateOld" ? "active" : ""
                      }
                    >
                      <span>Date: </span>plus ancien
                    </li>
                    <li
                      onClick={() => setSelectedSortOption("priceHigh")}
                      className={
                        selectedSortOption === "priceHigh" ? "active" : ""
                      }
                    >
                      <span>Prix: </span>plus elevé
                    </li>
                    <li
                      onClick={() => setSelectedSortOption("priceLow")}
                      className={
                        selectedSortOption === "priceLow" ? "active" : ""
                      }
                    >
                      <span>Prix: </span>plus bas
                    </li>
                  </ul>
                </div>
              )}
            </Transition>
          )}
        </div>
      </div>
      <div className="products-container">
        {currentData?.map((prod) => {
          return <Card prod={prod} key={prod.id} />;
        })}
      </div>
      <Center style={{ marginTop: "15px" }}>
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

export default CategoriesLayout;
