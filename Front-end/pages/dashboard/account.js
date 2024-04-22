import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import useAuth from "@/hooks/useAuth";
import Head from "next/head";

const Account = () => {
  const { isLoading, refresh, currentUser } = useAuth({
    middleware: "auth",
  });

  return (
    <DashboardLayout>
      <Head>
        <title>Votre compte</title>
      </Head>
      <h2>Compte</h2>
      <div className="diviser"></div>

      <div className="infos">
        <h3>Informations personnelles</h3>
        <div className="sub-diviser"></div>
        <h5>
          {"- " +
            currentUser?.data?.user.first_name +
            " " +
            currentUser?.data?.user.last_name}
        </h5>
        <h5>{"- " + currentUser?.data?.user.email}</h5>
      </div>
      <div className="infos">
        <div className="personal-infos">
          <h3>Mot de passe</h3>
          <div className="sub-diviser"></div>
          <div className="password">
            <span>+</span>
            <h5>Changer mot de passe</h5>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Account;
