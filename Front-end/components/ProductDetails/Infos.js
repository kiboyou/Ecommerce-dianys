import { Button } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { Toaster, toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

const Infos = ({
  prodData,
  imgData,
  prodSizes,
  prodColors,
  othersProducts,
}) => {
  const [chosenSize, setChosenSize] = useState({
    id: "",
    taille: "",
  });

  const [currentProd, setCurrentProd] = useState([]);

  const router = useRouter();

  const { addItem } = useCart();

  const soldePrice = React.useCallback(() => {
    const rate =
      prodData.prix * (prodData.taux_pourcentage / 100);
    const price = prodData.prix - rate;

    if (
      prodData.prix === 33000 &&
      prodData.taux_pourcentage === 15
    ) {
      return price - 50;
    }

    return price;
  }, [prodData.prix, prodData.taux_pourcentage]);

  useEffect(() => {
    if (prodData && prodData.tailles) {
      setSizes(prodData.tailles.split(","));
    }

    if (typeof prodData !== "undefined") {
      let updatedProducts = [];

      // if (chosenSize !== "" && chosenColor !== "") {
      updatedProducts.push({
        archiver: prodData.archiver,
        categorie: prodData.categorie,
        couleurs: prodData.couleurs,
        date_creation: prodData.date_creation,
        date_modification: prodData.date_modification,
        description: prodData.description,
        disponible: prodData.disponible,
        id: prodData.id,
        chosenSize: chosenSize,
        // chosenColor: chosenColor,
        image: prodData.image,
        nom_produit: prodData.nom_produit,
        price: prodData.solder
          ? soldePrice()
          : prodData.prix,
        solder: prodData.solder,
        sous_categorie: prodData.sous_categorie,
        tailles: prodData.tailles,
        taux_pourcentage: prodData.taux_pourcentage,
      });
      // }

      // Mettre à jour l'état "products" avec les nouvelles données
      setCurrentProd(updatedProducts);
    }
  }, [prodData, chosenSize, soldePrice]);

  const addToCard = (el) => {
    if (chosenSize.id !== "" || chosenSize.taille !== "") {
      addItem(el);
      toast.success("Produit ajouté au panier");
    } else {
      toast.error("Vous devez choisir une taille");
    }
  };

  const handleWhatsAppOrder = () => {
    if (currentProd.length > 0) {
      const productLink = encodeURIComponent(
        `https://dianys-boutique.com/produit/${currentProd[0].id}`
      );
      const phoneNumber = "2250544450567"; // Remplacez cela par le numéro de téléphone réel

      try {
        const whatsappLink = `https://wa.me/${phoneNumber}?text=Bonjour%20J'aimerais%20passer%20une%20commande%0A${productLink}`;

        // Redirigez vers le lien WhatsApp
        window.open(whatsappLink, "_blank");
      } catch (error) {
        console.error(
          "Erreur lors de la redirection vers WhatsApp",
          error
        );
      }
    } else {
      console.error(
        "Aucun produit actuellement sélectionné."
      );
    }
  };

  return (
    <div className="product-infos">
      <Toaster richColors position="top-right" />
      <div className="infos-content">
        <div className="description">
          <h5>A propos du produit</h5>
          <div
            dangerouslySetInnerHTML={{
              __html: prodData.description,
            }}
            className="description"
          />
        </div>
        <div className="price">
          <p>Prix unitaire :</p>
          <span>{soldePrice().toLocaleString()} FCFA</span>
        </div>
        <div className="size-container">
          <h5>choisir une taille :</h5>
          <ul>
            {prodSizes &&
              prodSizes
                .filter((el) => el.produit === prodData.id)
                .map((el) => (
                  <li key={el.id}>
                    <input
                      type="radio"
                      id={el.taille}
                      name="el-sizes"
                      onChange={() =>
                        setChosenSize({
                          taille: el.taille,
                          id: el.id,
                        })
                      }
                    />
                    <label htmlFor={el.taille}>
                      {el.taille}
                    </label>
                  </li>
                ))}
          </ul>
        </div>
        <div className="color">
          <h5>Couleurs disponibles :</h5>
          <ul>
            {othersProducts.map((el) => (
              <li key={el.id}>
                <Link
                  href="/produit/[id]"
                  as={`/produit/${el.id}`}
                >
                  <Image
                    src={el.image}
                    alt="product images"
                    width={70}
                    height={100}
                    loader={() => `${el.image}`}
                    className={
                      router.asPath === `/produit/${el.id}`
                        ? "active"
                        : ""
                    }
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="btn-container">
          <Button
            className="add-to-bag what-btn"
            onClick={handleWhatsAppOrder}
          >
            <FaWhatsapp size={"1.5rem"} />
            Commander sur whatsapp
          </Button>
          <Button
            className="add-to-bag"
            onClick={() => addToCard(currentProd[0])}
          >
            {/* <FiShoppingCart size={"1rem"} /> */}
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Infos;
