import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { GrInstagram } from "react-icons/gr";

const Footer = () => {
  return (
    <div className="footer">
      <div className="content">
        <div className="logo">
          <Image
            src="/assets/img/logo-orange.png"
            alt="logo dianys"
            width={100}
            height={50}
          />
        </div>
        <div className="categories">
          <h3>Catégories</h3>
          <ul>
            <li>
              <Link href={"/news"} style={{ color: "#202020" }}>
                Nouvel Arrivage
              </Link>
            </li>
            <li>
              <Link
                href={"/categories/chaussures/escarpin"}
                style={{ color: "#202020" }}
              >
                Escarpin
              </Link>
            </li>
            <li>
              <Link
                href={"/categories/chaussures/mules"}
                style={{ color: "#202020" }}
              >
                Mules
              </Link>
            </li>
            <li>
              <Link
                href={"/categories/chaussures/compensees"}
                style={{ color: "#202020" }}
              >
                Compensées
              </Link>
            </li>
            <li>
              <Link
                href={"/categories/chaussures/nu-pieds"}
                style={{ color: "#202020" }}
              >
                Nu-pieds
              </Link>
            </li>
            <li>
              <Link href={"/solde"} style={{ color: "#202020" }}>
                Soldes
              </Link>
            </li>
          </ul>
        </div>
        <div className="contact">
          <h3>Contact</h3>
          <ul>
            <li>
              <i className="fa-solid fa-phone"></i> +225 05 44 45 05 67
            </li>
            <li>dianys@gmail.com</li>
          </ul>
        </div>
        <div className="follow-us">
          <h3>Retrouvez-Nous sur </h3>
          <ul>
            <Link
              href={"https://www.facebook.com/profile.php?id=100095384119692"}
              style={{ color: "#202020" }}
              target="_blank"
            >
              <li>
                <span>
                  <BiLogoFacebook size={20} />
                </span>
                Facebook{" "}
              </li>
            </Link>
            <Link
              href={"https://www.instagram.com/diany_s225"}
              style={{ color: "#202020" }}
              target="_blank"
            >
              <li>
                <span>
                  <GrInstagram />
                </span>
                Instagram
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
