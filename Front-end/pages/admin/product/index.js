import AdminTopBar from "@/components/admin/AdminTopBar";
import { IoAddSharp } from "react-icons/io5";
import AdminLayout from "@/layouts/AdminLayout";
import { Button, Modal, ScrollArea } from "@mantine/core";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { LiaEditSolid } from "react-icons/lia";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import useSWR from "swr";
import EditProduct from "@/components/admin/EditProd";
import AddSubProduct from "@/components/admin/AddSubProd";
import { useViewportSize } from "@mantine/hooks";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Products = () => {
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

  const [opened, { open, close }] = useDisclosure(false);
  const [openModal, setOpenModal] = useState(false);
  const [prodId, setProdId] = useState();
  const [products, setProducts] = useState([]);
  const { width } = useViewportSize();

  const {
    data: prods,
    error,
    mutate,
  } = useSWR(`/produit/`, () =>
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/`, fetcher)
  );

  const { data: colors, error: colorsError } = useSWR(
    `/produit/produit/couleur`,
    () =>
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/couleur`,
        fetcher
      )
  );

  useEffect(() => {
    if (typeof prods !== "undefined" && typeof colors !== "undefined") {
      let updatedProducts = [];

      for (let i = 0; i < prods.data?.length; i++) {
        for (let j = 0; j < colors?.data.length; j++) {
          if (colors?.data[j].produit === prods.data[i]?.id) {
            updatedProducts.push({
              archiver: prods.data[i]?.archiver,
              categorie: prods.data[i]?.categorie,
              couleurs: prods.data[i]?.couleurs,
              date_creation: prods.data[i]?.date_creation,
              date_modification: prods.data[i]?.date_modification,
              description: prods.data[i]?.description,
              disponible: prods.data[i]?.disponible,
              id: prods.data[i]?.id,
              isMain: colors?.data[j]?.nom === "main" ? true : false,
              image: prods.data[i]?.image,
              nom_produit: prods.data[i]?.nom_produit,
              prix: prods.data[i]?.prix,
              solder: prods.data[i]?.solder,
              sous_categorie: prods.data[i]?.sous_categorie,
              tailles: prods.data[i]?.tailles,
              taux_pourcentage: prods.data[i]?.taux_pourcentage,
            });
          }
        }
        // }
      }

      setProducts(updatedProducts);
    }
  }, [prods?.data, colors?.data]);

  const handleClickEdit = (id) => {
    open();
    setProdId(id);
    setOpenModal(false);
  };

  const handleClickAdd = (id) => {
    open();
    setProdId(id);
    setOpenModal(true);
  };

  if (isLoading) {
    return <p>loading...</p>;
  }
  return (
    <AdminLayout>
      <Toaster richColors position="top-right" />
      <AdminTopBar />
      <Modal
        size={width < 1000 ? "100%" : "50%"}
        fullScreen={true}
        // withCloseButton={false}
        opened={opened}
        onClose={close}
        radius="10"
        // p={0}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 5,
        }}
        // scrollAreaComponent={ScrollArea.Autosize}
        padding={0}
        yOffset={140}
        styles={{
          root: {
            overflow: "hidden",
          },
          inner: { overflow: "hidden", minHeight: "100%" },
          content: {
            width: "100%",
            minHeight: "100%",
            // overflowX: "hidden",
            // boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)",
          },
          body: { overflow: "hidden", minHeight: "100%" },
        }}
      >
        {!openModal ? (
          <EditProduct prodId={prodId} edit={!openModal} />
        ) : (
          <AddSubProduct prodId={prodId} edit={openModal} />
        )}
      </Modal>
      <div className="product-top">
        <h2 style={{ padding: "0" }}>produits</h2>
        <Link href={"/admin/product/add"}>
          <Button color="#202020">Ajouter un produit</Button>
        </Link>
      </div>
      <ul className="prod-container">
        {products
          ?.sort((a, b) => b.id - a.id)
          .map((prod) => (
            <li key={prod.id}>
              {prod.image && (
                <Image
                  src={prod.image}
                  alt={"image de " + prod.nom_produit}
                  width={300}
                  height={200}
                  loading="lazy"
                  loader={() => `${prod.image}`}
                />
              )}
              <div className="infos">
                <h3>{prod.nom_produit}</h3>
                <p>{prod.prix.toLocaleString()} FCFA</p>
              </div>
              <span className="edit">
                <LiaEditSolid onClick={() => handleClickEdit(prod.id)} />
              </span>
              {prod.isMain && (
                <span className=" eddit add">
                  <HiOutlineViewGridAdd
                    onClick={() => handleClickAdd(prod.id)}
                  />
                </span>
              )}
            </li>
          ))}
      </ul>
    </AdminLayout>
  );
};

export default Products;
