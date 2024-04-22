import dynamic from "next/dynamic";
import AdminLayout from "@/layouts/AdminLayout";
import {
  Button,
  MultiSelect,
  Select,
  TextInput,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import { IoImageOutline } from "react-icons/io5";
import axios from "axios";
import useSWR from "swr";
import { Toaster, toast } from "sonner";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    ["bold", "italic"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
];

const fetcher = (...args) =>
  fetch(...args).then((res) => res.json());

const AddProduct = () => {
  const [image, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [available, setAvailable] = useState(true);
  const [solde, setSolde] = useState(false);
  const [archiver, setArchiver] = useState(false);
  const [categorie, setCategorie] = useState([]);
  const [subCategorie, setSubCategorie] = useState([]);
  const [size, setSize] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageRef = useRef();
  const nameRef = useRef();
  // const descriptionRef = useRef();
  const priceRef = useRef();
  const percentRef = useRef();
  const categorieRef = useRef();
  const subCategorieRef = useRef();

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
  }, [currentUser, isLoading, router]);

  //dropzone
  const {
    acceptedFiles: mainImageFiles,
    fileRejections: mainImageRejections,
    getRootProps: mainImageRootProps,
    getInputProps: mainImageInputProps,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/svg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,

    onDrop: (mainImageFiles) => {
      setImage(
        mainImageFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  //second images
  const {
    acceptedFiles: secondImageFiles,
    fileRejections: secondImageRejections,
    getRootProps: secondImageRootProps,
    getInputProps: secondImageInputProps,
  } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/svg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 4,
    onDrop: (secondImageFiles) => {
      setFiles(
        secondImageFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  //fetchCategories

  const { data: categoriesData, error: categorieError } =
    useSWR(`/categorie/`, () =>
      axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/`,
        fetcher
      )
    );

  const {
    data: subCategoriesData,
    error: subCategorieMuatate,
  } = useSWR(`/categorie/categorie/sous-categorie/`, () =>
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/categorie/sous-categorie/`,
      fetcher
    )
  );

  const addProd = async (e) => {
    e.preventDefault();

    if (
      priceRef.current.value === "" ||
      image.length === 0 ||
      files.length === 0 ||
      categorie.length === 0 ||
      subCategorie.length === 0 ||
      typeof description === "undefined" ||
      nameRef.current.value === "" ||
      subCategorie?.length < 0 ||
      size.length === 0
    ) {
      return toast.error(
        "Veuillez remplir correctement tous les champs"
      );
    }

    setLoading(true);

    const data = {
      nom_produit: nameRef.current.value,
      description,
      image: image[0],
      prix: priceRef.current.value,
      taux_pourcentage: percentRef.current.value,
      disponible: available,
      solder: solde,
      archiver: archiver,
      categorie: categorie[0]?.id,
      sous_categorie: subCategorie[0]?.id,
    };

    let res;

    try {
      res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Produit ajouté avec succes");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Erreur lors de l'ajout du produit");
    }

    // add images
    if (res?.status === 201) {
      for (let i = 0; i < files.length; i++) {
        try {
          const imageRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/image/`,
            { produit: res.data.id, image: files[i] },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } catch (error) {
          console.log("image upload error" + error);
          setLoading(false);
        }
      }
    }

    //pointures
    if (res?.status === 201) {
      for (let i = 0; i < size.length; i++) {
        console.log(size[i]);
        try {
          const sizeRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/pointure/`,
            {
              produit: res.data.id,
              taille: size[i],
              disponibilite: "1",
            }
          );
        } catch (error) {
          console.log("size upload error" + error);
          setLoading(false);
        }
      }
    }

    // color
    if (res?.status === 201) {
      const colorData = {
        nom: "main",
        produit: res.data.id,
        code_couleur: `${res.data.id}`,
      };
      try {
        const colorRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/couleur/`,
          colorData
        );

        setLoading(false);
      } catch (error) {
        console.log("add color error");
        setLoading(false);
      }
    }
  };

  return (
    <div className="add-product">
      <Toaster richColors position="top-right" />
      <Link
        href="/admin/product"
        style={{ color: "#202020" }}
      >
        <div className="add-back">
          <span className="icon">
            <IoIosArrowBack />
          </span>
          <p>Retour au tableau de bord</p>
        </div>
      </Link>
      <form className="add-prod" onSubmit={addProd}>
        <h3>Ajouter un produit</h3>

        <div className="form-item">
          <TextInput
            label="Nom du produit"
            ref={nameRef}
            placeholder="Nom du produit"
          />
        </div>
        <div className="form-item">
          <TextInput
            label="Prix"
            type="number"
            ref={priceRef}
            placeholder="prix du prdouit"
          />
        </div>
        <div className="form-item">
          <TextInput
            label="Taux de pourcentqge"
            type="number"
            defaultValue={0}
            ref={percentRef}
            placeholder="taux de pourcentage"
          />
        </div>
        <div className="form-item">
          <h3>Description</h3>
          <QuillNoSSRWrapper
            modules={modules}
            formats={formats}
            theme="snow"
            onChange={(content) => {
              // var htmlToRtf = require('html-to-rtf');
              setDescription(content);
            }}
          />
        </div>
        <div className="form-item">
          <Select
            label="Categorie"
            placeholder="Choisir une categorie"
            ref={categorieRef}
            data={categoriesData?.data.map(
              (el) => el.nom_categorie
            )}
            onChange={(e) =>
              setCategorie(
                categoriesData?.data.filter(
                  (el) => el.nom_categorie === e
                )
              )
            }
          />
        </div>
        <div className="form-item">
          <Select
            label="Sous-categorie"
            placeholder="choisir une sous-categorie"
            ref={subCategorieRef}
            // value={deliveryInfos.commune}
            data={subCategoriesData?.data.map(
              (el) => el.nom_sous_categorie
            )}
            onChange={(e) =>
              setSubCategorie(
                subCategoriesData?.data.filter(
                  (el) => el.nom_sous_categorie === e
                )
              )
            }
          />
        </div>
        <div className="form-item">
          <div className="form-item checkbox-container">
            <div className="checkbox">
              <label htmlFor="disponible">Disponible</label>
              <input
                type="checkbox"
                id="disponible"
                checked={available}
                onChange={() => setAvailable(!available)}
              />
            </div>
            <div className="checkbox">
              <label htmlFor="solde">Solde</label>
              <input
                type="checkbox"
                id="solde"
                checked={solde}
                onChange={() => setSolde(!solde)}
              />
            </div>
            <div className="checkbox">
              <label htmlFor="archiver">Archiver</label>
              <input
                type="checkbox"
                id="archiver"
                checked={archiver}
                onChange={() => setArchiver(!archiver)}
              />
            </div>
          </div>
        </div>

        {/* image  */}
        <div className="form-item">
          <h3>Image principal</h3>
          <section className="dropzone-container">
            <div
              {...mainImageRootProps({
                className: "dropzone",
              })}
            >
              <input
                {...mainImageInputProps()}
                ref={imageRef}
              />
              <div className="drop-text">
                <div className="icon">
                  <IoImageOutline />
                </div>
                <div className="info">
                  <p>
                    Glisser-déposer l&apos;image ici, ou
                    cliquer pour sélectionner une image
                  </p>
                  <em>(png , jpeg , svg, webp)</em>
                </div>
              </div>
            </div>
            {/* img thumb */}
            <aside className="thumbs-container">
              {image.map((file) => (
                <div className="thumb" key={file.name}>
                  <div className="thumb-inner">
                    <img
                      src={file.preview}
                      className="img"
                      // Revoke data uri after image is loaded
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                    />
                  </div>
                </div>
              ))}
            </aside>
          </section>
        </div>
        <div className="form-item">
          <h3>Images secondaires</h3>

          <section className="dropzone-container">
            <div
              {...secondImageRootProps({
                className: "dropzone",
              })}
            >
              <input
                {...secondImageInputProps()}
                ref={imageRef}
              />
              <div className="drop-text">
                <div className="icon">
                  <IoImageOutline />
                </div>
                <div className="info">
                  <p>
                    Glisser-déposer les images ici, ou
                    cliquer pour sélectionner
                  </p>
                  <em>(png , jpeg , svg,)</em>
                </div>
              </div>
            </div>
            {/* img thumb */}
            <aside className="thumbs-container">
              {files.map((file) => (
                <div className="thumb" key={file.name}>
                  <div className="thumb-inner">
                    <img
                      src={file.preview}
                      className="img"
                      // Revoke data uri after image is loaded
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                    />
                  </div>
                </div>
              ))}
            </aside>
          </section>
        </div>

        {/* pointures */}
        <div className="form-item">
          <MultiSelect
            label="Pointures"
            placeholder="Choisir des pointures"
            data={[
              "36",
              "37",
              "38",
              "39",
              "40",
              "41",
              "42",
              "43",
              "44",
              "45",
            ]}
            onChange={(e) => setSize(e)}
          />
        </div>

        {/* couleurs */}
        <Button
          type="submit"
          onSubmit={addProd}
          className="add-btn"
          loading={loading}
        >
          AJouter
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
