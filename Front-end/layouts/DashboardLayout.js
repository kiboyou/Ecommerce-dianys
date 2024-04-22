import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Link from "next/link";
import React from "react";
import { LiaUserCircle } from "react-icons/lia";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/router";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  return (
    <div className="dashboard">
      <header>
        <Nav />
      </header>
      <div className="dashboard-content">
        <ul className="sidebar">
          <Link
            href={"/dashboard/account"}
            className={router.pathname === "/dashboard/account" ? "active" : ""}
          >
            <span>
              <LiaUserCircle />
            </span>
            <li>Compte</li>
          </Link>
          <Link
            href={"/dashboard/order"}
            className={router.pathname === "/dashboard/order" ? "active" : ""}
          >
            <span>
              <PiShoppingBagOpenLight />
            </span>
            <li>Commandes</li>
          </Link>

          <div className="diviser"></div>

          <a className="logout">
            <span>
              <IoLogOutOutline />
            </span>
            <li>Déconnexion</li>
          </a>
        </ul>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
