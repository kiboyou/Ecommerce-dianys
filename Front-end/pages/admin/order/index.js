import AdminTopBar from "@/components/admin/AdminTopBar";
import OrderRow from "@/components/admin/OrderRow";
import AdminLayout from "@/layouts/AdminLayout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Pusher from "pusher-js";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
// import sound from "../../../public/assets/song/mixkit-gaming-lock-2848.wav";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Orders = () => {
  const [activeNav, setActiveNav] = useState("Tout");
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
  // const [playSound, setPlaySound] = useState(false);

  // const [notifications, setNotifications] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const storedNotifications = localStorage.getItem("orderNotifs");
  //     return storedNotifications ? JSON.parse(storedNotifications) : [];
  //   }
  // });

  // hanlde notifs
  // useEffect(() => {
  //   const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  //     cluster: "eu",
  //   });
  //   const channel = pusher.subscribe("orders");

  //   const handleNewOrder = function (data) {
  //     setNotifications((prevNotifications) => [...prevNotifications, data]);
  //     setPlaySound(true);
  //   };

  //   channel.bind("newOrder", handleNewOrder);

  //   return () => {
  //     channel.unbind("newOrder", handleNewOrder);
  //     pusher.unsubscribe("orders");
  //   };
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("orderNotifs", JSON.stringify(notifications));

  //   if (playSound) {
  //     const audio = new Audio(
  //       "../../../public/assets/song/mixkit-gaming-lock-2848.wav"
  //     );
  //     audio.play();
  //     // Réinitialiser l'état pour éviter de jouer le son à chaque rendu
  //     setPlaySound(false);
  //   }
  // }, [notifications]);

  const {
    data: ordersData,
    error,
    mutate,
  } = useSWR(`/commande/`, () =>
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/commande/`, fetcher, {
      refreshInterval: 1000,
    })
  );

  return (
    <AdminLayout>
      <AdminTopBar />
      <h2>Commandes</h2>
      <div className="body">
        <div className="nav">
          <ul>
            <li
              className={activeNav === "Tout" ? "active" : ""}
              onClick={() => setActiveNav("Tout")}
            >
              Tout
            </li>
            <li>En cours</li>
            <li>Effectué</li>
          </ul>
        </div>
        <div className="orderLabels">
          <ul>
            <li>Num commande</li>
            <li>Prix Total</li>
            <li>Client</li>
            <li>Adresse</li>
            <li>Date</li>
            <li>Mode de paiement</li>
            <li>Satut</li>
            <li>Action</li>
          </ul>
          <div className="orderDisplay">
            {ordersData?.data
              .sort((a, b) => b.id - a.id)
              .map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
