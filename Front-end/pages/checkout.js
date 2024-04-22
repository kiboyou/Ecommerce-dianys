import { Button, Radio, Select, TextInput } from "@mantine/core";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "react-use-cart";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import axios from "axios";
import cities from "@/lib/city";
import commune from "@/lib/commune";
import { Toaster, toast } from "sonner";
import Pusher from "pusher-js";
import { mutate } from "swr";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const Checkout = () => {
  const { currentUser, isLoading } = useAuth({
    middleware: "auth",
  });

  const [currentClient, setCurrentClient] = useState([]);
  const [loading, setLoading] = useState(false);

  const { items, cartTotal } = useCart();

  const getPhone = () => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("phone") || "";
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return "";
  };

  const [phone, setPhone] = useState(getPhone());

  function generateUniqueOrderCode() {
    const timestampInSeconds = Math.floor(Date.now());

    const uniqueId = Math.floor(Math.random() * 1000);

    const code = `${timestampInSeconds}${uniqueId}`;
    const slice = 8;
    const orderCode = code.slice(slice);

    return orderCode;
  }

  // get delivery infos from localStorage and stored them in the state
  const getInitialDeliveryInfos = () => {
    if (typeof window !== "undefined") {
      try {
        return (
          JSON.parse(localStorage.getItem("deliveryInfos")) || {
            firstName: "",
            lastName: "",
            email: "",
            phone: phone,
            city: "",
            commune: "",
            country: "",
            address: "",
          }
        );
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      commune: "",
      country: "",
      address: "",
    };
  };

  const sendNotif = async () => {
    await axios
      .post("/api/pusher", { message: "Nouvelle commande passée !" })
      .then((res) => console.log(res));
  };

  //get phone value from localSorage
  const [deliveryInfos, setDeliveryInfos] = useState(getInitialDeliveryInfos);

  const isValid = isPhoneValid(phone);

  const saveToLocaleStorage = () => {
    localStorage.setItem("deliveryInfos", JSON.stringify(deliveryInfos));
    localStorage.setItem("phone", phone);
  };

  // get the current client and carts
  const getClients = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/`
      );

      const currentClient = await res.data?.filter(
        (el) => el.user === currentUser?.data?.user.id
      );

      localStorage.setItem("clientId", JSON.stringify(currentClient[0]?.id));

      setCurrentClient(currentClient);
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect
  useEffect(() => {
    saveToLocaleStorage();
    getClients();
  }, [deliveryInfos, phone, currentUser]);

  const getClientId = () => {
    const id = localStorage.getItem("clientId");
    return id ? JSON.parse(id) : "";
  };

  //add items to carts
  const addCart = async () => {
    const date = new Date();
    const itemId = [];

    const id = await getClientId();

    for (let i = 0; i < items.length; i++) {
      const formData = new FormData();
      formData.append("quantite", items[i].quantity);
      formData.append("prix_total_article", items[i].itemTotal);
      // formData.append("commander", true);
      formData.append("date_commande", date.toISOString().split("T")[0]);
      formData.append("client", id);
      formData.append("produit", items[i].id);
      // formData.append("couleur", "");
      formData.append("pointure", items[i].chosenSize.id);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/panier/panier/article/`,
          formData
        );

        itemId.push(res.data.id);

        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    localStorage.setItem("ids", JSON.stringify(itemId));
  };

  const getIds = () => {
    const ids = localStorage.getItem("ids");
    // console.log(ids);
    return ids ? JSON.parse(ids) : [];
  };

  //save <order></order>
  const saveOrder = async (cartId) => {
    const date = new Date();
    const orderNumber = generateUniqueOrderCode();
    try {
      const formData = new FormData();
      formData.append("num_commande", `#${orderNumber}`);
      formData.append("mode_livraison", "livraison");
      formData.append("date_livraison", date.toISOString().split("T")[0]);
      formData.append(
        "adresse_livraison",
        `${deliveryInfos.lastName} , ${deliveryInfos.firstName} , ${deliveryInfos.address} , ${deliveryInfos.city} , ${deliveryInfos.commune} , ${phone}`
      );
      formData.append("prix_livraison", 0);
      formData.append("prix_commande", cartTotal);
      formData.append("date_commander", date.toISOString().split("T")[0]);
      formData.append("etat_commande	", true);
      formData.append("panier", cartId);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/commande/`,
        formData
      );

      mutate(`${process.env.NEXT_PUBLIC_BACKEND_URL}/commande/`);

      // await axios.post("/api/order/notif");

      console.log(res);
    } catch (error) {
      console.log("error to save order" + error);
    }
  };

  //get added cart id
  const getCartId = () => {
    const id = localStorage.getItem("cartId");
    return id ? JSON.parse(id) : [];
  };

  //checkout
  const checkout = async () => {
    try {
      if (
        deliveryInfos.firstName === "" ||
        deliveryInfos.lastName === "" ||
        !isValid ||
        deliveryInfos.city === "" ||
        deliveryInfos.commune === "" ||
        deliveryInfos.address === ""
      ) {
        return toast.error(
          "Veuillez remplir correctement les informations de livraisons"
        );
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("telephone", phone);
      formData.append("ville", deliveryInfos.city);
      formData.append("date_naissance", "01-01-2001");
      formData.append("sexe", "NAN");
      formData.append("habitation", deliveryInfos.address);
      formData.append("commun", deliveryInfos.commune);
      formData.append("user", currentUser.data.user.id);

      if (currentClient.length === 0) {
        // Case where the client doesn't exist yet
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/client/`,
          formData
        );
        console.log(res);

        await getClients(); // Update the list of clients after adding a new one
        const id = await getClientId();
        await addCart();

        // Add items to the cart

        const ids = await getIds();
        // Save the cart for the new client
        const saveCartRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/panier/`,
          {
            prix_total: cartTotal,
            client: id,
            article: ids,
          }
        );

        localStorage.setItem("cartId", JSON.stringify(saveCartRes.data.id));

        const cartId = await getCartId();

        await saveOrder(cartId);

        console.log(saveCartRes);
        setLoading(false);
        toast.success("votre commande a bien été confimée");
      } else {
        // Case where the client already exists
        await addCart(); // Add items to the cart

        const ids = await getIds();

        // Add a new cart for the existing client if no cart exists yet
        const saveCartRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/panier/`,
          {
            prix_total: cartTotal,
            client: currentClient[0].id,
            article: ids,
          }
        );

        localStorage.setItem("cartId", JSON.stringify(saveCartRes.data.id));

        console.log(saveCartRes);
        const cartId = await getCartId();

        await saveOrder(cartId);

        setLoading(false);
        toast.success("votre commande a bien été confimée");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error(
        "Une erreur est survenue lors de la confirmaton de votre commande."
      );
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <Toaster richColors position="top-right" />
      <div className="checkout-content">
        <Link href={"/cart"}>
          <div className="back">
            <span className="icon">
              <IoIosArrowBack />
            </span>
            <p>Retour au panier</p>
          </div>
        </Link>
        <h3>Informations de livraisons</h3>
        <div className="delivery-infos">
          <div className="left">
            <div className="content">
              <h4>Informations personelles</h4>
              <div className="item">
                <TextInput
                  label="Nom"
                  placeholder="Nom"
                  value={deliveryInfos.lastName}
                  onChange={(e) =>
                    setDeliveryInfos((prevDeliveryInfos) => ({
                      ...prevDeliveryInfos,
                      lastName: e.target.value,
                    }))
                  }
                />
                <TextInput
                  label="Prénom"
                  placeholder="Prénom"
                  value={deliveryInfos.firstName}
                  onChange={(e) =>
                    setDeliveryInfos((prevDeliveryInfos) => ({
                      ...prevDeliveryInfos,
                      firstName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="item">
                <div className="phone-input">
                  <label htmlFor="phone">Numéro de téléphone</label>
                  <PhoneInput
                    id="phone"
                    defaultCountry="ci"
                    // forceDialCode={true}
                    CustomFlagImage
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                  />
                </div>
              </div>
              <h4>Coordonnées</h4>
              <div className="item">
                <Select
                  label="Ville"
                  placeholder="Ville"
                  value={deliveryInfos.city}
                  data={cities}
                  onChange={(selectedValue) =>
                    setDeliveryInfos((prevDeliveryInfos) => ({
                      ...prevDeliveryInfos,
                      city: selectedValue,
                    }))
                  }
                />
                <Select
                  label="Commune"
                  placeholder="Ccommune"
                  value={deliveryInfos.commune}
                  data={commune}
                  onChange={(selectedValue) =>
                    setDeliveryInfos((prevDeliveryInfos) => ({
                      ...prevDeliveryInfos,
                      commune: selectedValue,
                    }))
                  }
                />
              </div>
              <div className="item">
                <TextInput
                  label="Adresse"
                  placeholder="Adresse"
                  value={deliveryInfos.address}
                  onChange={(e) =>
                    setDeliveryInfos((prevDeliveryInfos) => ({
                      ...prevDeliveryInfos,
                      address: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="choose-payement-option">
              <h3>Mode de paiement</h3>
              <div className="option checked">
                <Radio
                  label="Payer à la livraison"
                  color="#202020"
                  defaultChecked
                  // onChange={(e) => setChecked(e.target.value)}
                  name="pay-option"
                />
                <div className="icon">
                  <Image
                    src="/assets/img/delivery_img.png"
                    priority
                    width={50}
                    height={35}
                    alt="logo-delivery"
                  />
                </div>
              </div>
              <div className="option">
                <div>
                  <Radio
                    label="Orange Money"
                    disabled
                    // onChange={(e) => setChecked(e.target.value)}
                    // checked={checked}

                    name="pay-option"
                  />
                </div>
                <div className="icon">
                  <Image
                    src="/assets/img/Orange-Money-emblem.png"
                    width={50}
                    height={35}
                    alt="logo orange money"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="summary">
            <h3>résumé de la commande</h3>
            <div className="diviser"></div>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <div className="left">
                    <Image
                      src={item.image}
                      alt={`${item.image} image`}
                      loader={() => `${item.image}`}
                      width={100}
                      height={100}
                      priority
                    />
                  </div>
                  <div className="right">
                    <div className="top">
                      <h5>{item.nom_produit}</h5>
                      <h5> {item.itemTotal.toLocaleString()} FCFA</h5>
                    </div>
                    <div className="choices">
                      <span>
                        Taille: <p>{item.chosenSize.taille}</p>
                      </span>
                      {/* <span>
                        Couleur: <p>{item.chosenColor}</p>
                      </span> */}
                    </div>
                    <h5 className="qty">
                      Quantité: <span>{item.quantity}</span>
                    </h5>
                  </div>
                </li>
              ))}
            </ul>
            <div className="diviser"></div>
            <div className="total">
              <span>Total</span>
              <p>{cartTotal.toLocaleString()} FCFA</p>
            </div>
            <div className="diviser"></div>
            <Button onClick={checkout} loading={loading}>
              Confirmer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
