import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Images from "@/components/ProductDetails/Images";
import Infos from "@/components/ProductDetails/Infos";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

const Produit = ({ produit, prodColorsData, prodData }) => {
  const [currentImgData, setCurrentImgData] = useState([]);
  const [prodSizes, setProdSizes] = useState([]);
  const [prodColors, setProdColors] = useState([]);
  const [code, setCode] = useState("");
  const [othersProducts, setOthersProducts] = useState([]);

  const stripHtml = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const fetchData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/pointure/`)
      .then((res) =>
        setProdSizes(res.data.filter((el) => el.produit === produit.id))
      );
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/couleur/`)
      .then((res) =>
        setProdColors(res.data.filter((el) => el.produit === produit.id))
      );

    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/image/`)
      .then((res) => {
        const filteredDara = res.data.filter(
          (prod) => prod.produit === produit.id
        );
        setCurrentImgData(filteredDara);
      });
  };

  useEffect(() => {
    let othersProds = [];

    for (let i = 0; i < prodColorsData.length; i++) {
      if (prodColorsData[i].produit === produit.id) {
        setCode(prodColorsData[i].code_couleur);
      }
    }

    for (let i = 0; i < prodData?.length; i++) {
      if (
        prodColorsData.some(
          (color) =>
            color.produit === prodData[i].id && color.code_couleur === code
        )
      ) {
        othersProds.push(prodData[i]);
      }
    }

    setOthersProducts(othersProds);

    fetchData();
  }, [produit, code, prodData, prodColorsData]);

  return (
    <div className="product-detail">
      <Head>
        <meta property="og:site_name" content="dianys boutique" />
        <meta property="og:title" content={produit.nom_produit} />
        <meta
          property="og:description"
          content={stripHtml(produit.description)}
        />
        <meta property="og:image" content={produit.image} />
        <meta property="og:type" content="website" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta
          property="og:url"
          content={`https://dianys-boutique.com/produit/${produit.id}`}
        />
      </Head>
      <header>
        <Nav />
      </header>

      <div className="main-container">
        <Link href={"/products"} style={{ color: "black" }}>
          <div className="back">
            <span className="icon">
              <IoIosArrowBack />
            </span>
            <p>Retour au produits</p>
          </div>
        </Link>
        <h3>{produit.nom_produit}</h3>
        <div className="content">
          {currentImgData && <Images imgData={currentImgData} />}

          <Infos
            prodData={produit}
            imgData={currentImgData}
            prodSizes={prodSizes}
            prodColors={prodColors}
            othersProducts={othersProducts}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Produit;

export const getStaticProps = async (context) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/${context.params.id}/`
  );

  const prods = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/`
  );
  const colors = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/couleur/`
  );
  const prodData = prods.data;
  const prodColorsData = colors.data;

  const produit = res.data;

  return {
    props: {
      produit,
      prodColorsData,
      prodData,
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/`);

  const products = await res.json();

  const ids = products.map((prod) => prod.id);

  const paths = ids.map((id) => ({ params: { id: id.toString() } }));

  return {
    paths,
    fallback: false,
  };
};
