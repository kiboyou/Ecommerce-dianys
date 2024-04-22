import dynamic from "next/dynamic";

import AdminTopBar from "@/components/admin/AdminTopBar";
import AdminLayout from "@/layouts/AdminLayout";
import { Button, MultiSelect, Select, TextInput } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-quill/dist/quill.snow.css";
import { IoImageOutline } from "react-icons/io5";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import { set } from "react-hook-form";

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

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const EditProduct = ({ prodId, edit }) => {
  const [prod, setProd] = useState([]);
  const [image, setImage] = useState([]);
  const [description, setDescription] = useState(prod.description);
  const [files, setFiles] = useState([]);
  const [available, setAvailable] = useState(prod?.disponible);
  const [solde, setSolde] = useState(prod.solder);
  const [archiver, setArchiver] = useState(prod.archiver);
  const [categorie, setCategorie] = useState([]);
  const [subCategorie, setSubCategorie] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [subCategoriesData, setSubCategoriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [isMain, setIsMain] = useState(false);
  const [size, setSize] = useState([]);

  const imageRef = useRef();
  const nameRef = useRef();
  // const descriptionRef = useRef();
  const priceRef = useRef();
  const percentRef = useRef();
  const categorieRef = useRef();
  const subCategorieRef = useRef();
  const availableRef = useRef();

  const router = useRouter();

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

  //fetchData
  const fetchData = async () => {
    const prod = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/${prodId}/`,
      fetcher
    );

    setDescription(prod.data.description);
    setProd(prod.data);

    //categories
    const categories = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/`
    );

    setCategoriesData(categories.data);
    setCategorie(
      categories.data.filter((el) => el.id === prod.data.categorie)[0]
        .nom_categorie
    );

    //subCategories
    const subCategories = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/categorie/categorie/sous-categorie/`
    );
    setSubCategorie(
      subCategories.data.filter((el) => el.id === prod.data.sous_categorie)[0]
        .nom_sous_categorie
    );
    setSubCategoriesData(subCategories.data);

    //sizes
    const sizes = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/pointure/`
    );
    const filteredSizes = sizes.data.filter((el) => el.produit === prodId);
    setSize(filteredSizes.map((el) => el.taille));
  };

  useEffect(() => {
    fetchData();
  }, [prodId]);

  const addProd = async (e) => {
    e.preventDefault();

    if (
      priceRef.current.value === "" ||
      image.length === 0 ||
      categorie.length === 0 ||
      subCategorie.length === 0 ||
      typeof description === "undefined" ||
      nameRef.current.value === "" ||
      subCategorie?.length < 0
      // size.length === 0
    ) {
      return toast.error("Veuillez remplir correctement tous les champs");
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
      res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/${prodId}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Produit ajouté avec succes");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Erreur lors de la modification du produit");
    }

    // add images

    // if (files.length !== 0) {
    //   for (let i = 0; i < files.length; i++) {
    //     try {
    //       const imageRes = await axios.post(
    //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/image/`,
    //         { produit: res.data.id, image: files[i] },
    //         {
    //           headers: {
    //             "Content-Type": "multipart/form-data",
    //           },
    //         }
    //       );

    //       console.log(imageRes);
    //     } catch (error) {
    //       console.log("image upload error" + error);
    //     }
    //   }
    // }

    // pointures;
    // for (let i = 0; i < size.length; i++) {
    //   console.log(size[i]);
    //   try {
    //     const sizeRes = await axios.patch(
    //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/image/`,
    //       { produit: res.data.id, taille: size[i], disponibilite: "1" }
    //     );

    //     console.log(sizeRes);
    //   } catch (error) {
    //     console.log("image upload error" + error);
    //   }
    // }

    // color
    // colorData = {
    //   nom: isMain === true ? "main" : "second",
    //   produit: res.data.id,
    //   code_couleur: "",
    // };

    // try {
    //   const colorRes = await axios.post(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/produit/produit/couleur/`,
    //     {
    //       n,
    //     }
    //   );

    //   console.log(colorRes);
    // } catch (error) {
    //   console.log("add color error" + error);
    // }
  };

  console.log(prodId);

  return (
    <div>
      <form
        className={
          router.pathname === "/admin/product" && edit
            ? "add-prod edit"
            : "add-prod"
        }
        onSubmit={addProd}
      >
        <h3>Modifier le produit</h3>
        <div className="form-item">
          <TextInput
            label="Nom du produit"
            ref={nameRef}
            defaultValue={prod?.nom_produit}
          />
        </div>
        <div className="form-item">
          <TextInput
            label="Prix"
            type="number"
            ref={priceRef}
            defaultValue={prod?.prix}
          />
        </div>
        <div className="form-item">
          <TextInput
            label="Taux de pourcentqge"
            defaultValue={prod?.taux_pourcentage}
            type="number"
            ref={percentRef}
          />
        </div>
        <div className="form-item">
          <h3>Description</h3>

          <QuillNoSSRWrapper
            modules={modules}
            formats={formats}
            value={description}
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
            data={categoriesData.map((el) => el.nom_categorie)}
            value={categorie}
            onChange={(e) =>
              setCategorie(
                categoriesData.filter((el) => el.nom_categorie === e)
              )
            }
            clearable
          />
        </div>
        <div className="form-item">
          <Select
            label="Sous-categorie"
            placeholder="choisir une sous-categorie"
            ref={subCategorieRef}
            value={subCategorie}
            data={subCategoriesData.map((el) => el.nom_sous_categorie)}
            onChange={(e) =>
              setSubCategorie(
                subCategoriesData.filter((el) => el.nom_sous_categorie === e)
              )
            }
            clearable
          />
        </div>
        <div className="form-item">
          <div className="form-item">
            {/* <label htmlFor="main-prod">Premier Produit</label>
            <input
              type="checkbox"
              id="main-prod"
              name="main"
              checked={isMain}
              onChange={() => setIsMain(!isMain)}
            /> */}
            <label htmlFor="disponible">Disponible</label>
            <input
              type="checkbox"
              id="disponible"
              defaultChecked={prod?.disponible}
              onChange={() => setAvailable(!available)}
            />
            <label htmlFor="solde">Solde</label>
            <input
              type="checkbox"
              id="solde"
              checked={solde}
              onChange={() => setSolde(!solde)}
            />
            <label htmlFor="archiver">Archiver</label>
            <input
              type="checkbox"
              id="archiver"
              defaultChecked={prod?.archiver}
              onChange={() => setArchiver(!archiver)}
            />
          </div>
        </div>

        {/* image  */}
        <div className="form-item">
          <h3>Image principal</h3>
          <section className="dropzone-container">
            <div {...mainImageRootProps({ className: "dropzone" })}>
              <input {...mainImageInputProps()} ref={imageRef} />
              <div className="drop-text">
                <div className="icon">
                  <IoImageOutline />
                </div>
                <div className="info">
                  <p>
                    Glisser-déposer l&apos;image ici, ou cliquer pour
                    sélectionner une image
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
        {/* <div className="form-item">
          <h3>Images secondaires</h3>

          <section className="dropzone-container">
            <div {...secondImageRootProps({ className: "dropzone" })}>
              <input {...secondImageInputProps()} ref={imageRef} />
              <div className="drop-text">
                <div className="icon">
                  <IoImageOutline />
                </div>
                <div className="info">
                  <p>
                    Glisser-déposer les images ici, ou cliquer pour sélectionner
                  </p>
                  <em>(png , jpeg , svg,)</em>
                </div>
              </div>
            </div>
            {/* img thumb */}
        {/* <aside className="thumbs-container">
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
          </section> */}
        {/* </div>  */}

        {/* pointures */}
        {/* <div className="form-item">
          <MultiSelect
            label="Pointures"
            placeholder="Choisir des pointures"
            value={size}
            data={["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]}
            onChange={(e) => setSize(e)}
            clearable
          />
        </div> */}

        {/* couleurs */}
        <Button
          type="submit"
          onSubmit={addProd}
          className="add-btn"
          loading={loading}
        >
          Modifier le produit
        </Button>
      </form>
    </div>
  );
};

export default EditProduct;
