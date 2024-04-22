import React from "react";
import Image from "next/image";
import Link from "next/link";

const Categories = () => {
  return (
    <div className="categories">
      {/* <h2 className="font-bold">Catégories</h2>
      <h4>
        Trouver les meilleurs Vêtements, Chaussures et Accessoires de la mode
        féminine
      </h4> */}
      <div className="content">
        <Link href={"/news"}>
          <Image
            className="bg-img"
            src="/assets/img/new-arrivage.jpg"
            alt="icon-hanger"
            width={640}
            height={300}
          />
        </Link>
        <Link href={"/categories/chaussures/escarpin"}>
          <Image
            className="bg-img"
            src="/assets/img/escarpin.jpg"
            alt="icon-hanger"
            width={640}
            height={300}
          />
        </Link>
        <Link href={"/categories/chaussures/mules"}>
          <Image
            className="bg-img"
            src="/assets/img/mules.jpg"
            alt="icon-hanger"
            width={640}
            height={300}
          />
        </Link>
        <Link href={"/categories/chaussures/compensees"}>
          <Image
            className="bg-img"
            src="/assets/img/compensees.jpg"
            alt="icon-hanger"
            width={640}
            height={300}
          />
        </Link>
        <Link href={"/categories/chaussures/nu-pieds"}>
          <Image
            className="bg-img"
            src="/assets/img/nu-pieds.jpg"
            alt="icon-hanger"
            width={640}
            height={300}
          />
        </Link>
        <Link href={"/solde"}>
          <Image
            className="bg-img"
            src="/assets/img/soldes.jpg"
            alt="icon-hanger"
            width={640}
            height={300}
          />
        </Link>
      </div>
    </div>
  );
};

export default Categories;
