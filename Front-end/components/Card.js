import Link from "next/link";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { useCart } from "react-use-cart";
import { Button, Modal, Skeleton } from "@mantine/core";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Image from "next/image";

const Card = ({ prod, loading }) => {
  const { addItem } = useCart();

  const [opened, { open, close }] = useDisclosure(false);
  const [prodSizes, setProdSizes] = useState([]);
  const [currentProd, setCurrentProd] = useState([]);
  const [chosenSize, setChosenSize] = useState({
    id: "",
    taille: "",
  });

  const addToCard = (el) => {
    if (chosenSize.id !== "" || chosenSize.taille !== "") {
      addItem(el);
      toast.success("Produit ajouté au panier");
    } else {
      toast.error("Vous devez choisir une taille");
    }
  };

  const soldePrice = React.useCallback(() => {
    const rate = prod.price * (prod.taux_pourcentage / 100);
    const price = prod.price - rate;

    if (
      prod.price === 33000 &&
      prod.taux_pourcentage === 15
    ) {
      return price - 50;
    }

    return price;
  }, [prod.price, prod.taux_pourcentage]);

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/pointure/`
        )
        .then((res) =>
          setProdSizes(
            res.data.filter((el) => el.produit === prod.id)
          )
        );
    };

    fetchData();

    if (typeof prod !== "undefined") {
      let updatedProducts = [];

      // if (chosenSize !== "" && chosenColor !== "") {
      updatedProducts.push({
        archiver: prod.archiver,
        categorie: prod.categorie,
        couleurs: prod.couleurs,
        date_creation: prod.date_creation,
        date_modification: prod.date_modification,
        description: prod.description,
        disponible: prod.disponible,
        id: prod.id,
        chosenSize: chosenSize,
        // chosenColor: chosenColor,
        image: prod.image,
        nom_produit: prod.nom_produit,
        price: prod.solder ? soldePrice() : prod.price,
        solder: prod.solder,
        sous_categorie: prod.sous_categorie,
        tailles: prod.tailles,
        taux_pourcentage: prod.taux_pourcentage,
      });
      // }

      // Mettre à jour l'état "products" avec les nouvelles données
      setCurrentProd(updatedProducts);
    }
  }, [prod, chosenSize]);

  return (
    <li className="card">
      {prod.solder && <span className="solde">-15%</span>}
      <Toaster richColors position="top-right" />
      <Modal
        opened={opened}
        styles={{
          content: { padding: "5px 20px" },
        }}
        mt={100}
        radius={10}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        <div className="modal-content">
          <div className="size-container">
            <h5>choisir une taille :</h5>
            <ul>
              {prodSizes &&
                prodSizes.map((el) => (
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

          <Button onClick={() => addToCard(currentProd[0])}>
            Ajouter au panier
          </Button>
        </div>
      </Modal>
      {/* <Skeleton height={200} /> */}
      <Link href="/produit/[id]" as={`/produit/${prod.id}`}>
        {loading ? (
          <div className="skeleton"></div>
        ) : (
          prod.image && (
            <Image
              src={prod.image}
              alt={"image de " + prod.nom_produit}
              width={300}
              height={200}
              loading="lazy"
              loader={() => `${prod.image}`}
            />
          )
        )}
      </Link>
      <div className="content">
        <Link
          href="produit/[id]"
          as={`/produit/${prod.id}`}
        >
          <h3>{prod.nom_produit}</h3>
        </Link>
        <div>
          <Link
            href="produit/[id]"
            as={`/produit/${prod.id}`}
          >
            {prod.solder && (
              <p className="solde-price">
                {prod.price.toLocaleString() + " FCFA"}
                <p className="bar"></p>
              </p>
            )}
            <p> {soldePrice().toLocaleString()} FCFA</p>
          </Link>
          <span onClick={open}>
            <FaShoppingBag />
          </span>
        </div>
      </div>
    </li>
    //{" "}
  );
};

export default Card;
