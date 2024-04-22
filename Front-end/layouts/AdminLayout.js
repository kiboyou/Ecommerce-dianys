import Link from "next/link";
import React, { useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { BsHandbag } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import Image from "next/image";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";

const AdminLayout = ({ children }) => {
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
  return (
    <div className="admin-dashboard">
      <div className="content">
        <div className="sidebar">
          <div className="logo">
            <Image
              src="/assets/img/logo-white.png"
              width={100}
              height={28}
              alt="logo diany's"
            />
          </div>
          <ul>
            <Link href={"/admin/dashboard"}>
              <span className="icon">
                <RxDashboard />
              </span>
              <li>Tableau de bord</li>
            </Link>
            <Link href={"/admin/product"}>
              <span className="icon">
                <BsHandbag />
              </span>
              <li>Produits</li>
            </Link>
            <Link href={"/admin/order"}>
              <span className="icon">
                <IoBagCheckOutline />
              </span>
              <li>Commandes</li>
            </Link>
            <Link href={"/admin/dashboard"}>
              <span className="icon">
                <IoBagCheckOutline />
              </span>
              <li>Clients</li>
            </Link>
          </ul>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
