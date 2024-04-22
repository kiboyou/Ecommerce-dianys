import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import React from "react";
import useSWR from "swr";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Button } from "@mantine/core";
import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const OrderRow = ({ order }) => {
  const {
    data: cart,
    error,
    mutate,
    isLoading: cartLoading,
  } = useSWR(`/panier/${order.panier}`, () =>
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/panier/${order.panier}/`)
  );
  //   console.log(cart);

  const {
    data: client,
    error: clientError,
    mutate: clientMutate,
  } = useSWR(`/client/${cart?.data?.client}/`, () =>
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/${cart?.data?.client}/`
    )
  );

  const {
    data: user,
    error: userError,
    mutate: userMutate,
  } = useSWR(`/utilisateur/CreationUtilisateur/${client?.data?.user}`, () =>
    axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/utilisateur/CreationUtilisateur/${client?.data?.user}`
    )
  );

  // console.log(order);

  const dateFornater = () => {
    dayjs.locale("fr");
    const date = dayjs(order.date_commander).format("dddd, D MMM, YYYY");

    return date;
  };

  return (
    <ul className="orderRow">
      <li>{order.num_commande}</li>
      <li>{order.prix_commande.toLocaleString()}</li>
      <li>
        {user?.data?.data?.last_name} {user?.data?.data?.first_name}
      </li>
      <li>{order.adresse_livraison.split(",")[2]}</li>
      <li>{dateFornater()}</li>
      <li>{order.mode_livraison}</li>
      <li className="status">
        <div
          className={
            order.etat_commande === true
              ? "status-content"
              : "status-content done"
          }
        >
          <span>{order.etat_commande === true ? "en cours" : "effectué"}</span>
        </div>
      </li>
      <li className="action">
        <Link
          href="/admin/order/[id]"
          as={`/admin/order/${order.id}`}
          style={{ color: "black" }}
        >
          Voir plus
        </Link>
      </li>
    </ul>
  );
};

export default OrderRow;
