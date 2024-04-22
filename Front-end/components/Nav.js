// "use client";

import {
  Avatar,
  Menu,
  TextInput,
  Drawer,
  Modal,
  Accordion,
  rem,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { useCart } from "react-use-cart";
import { IoSearchOutline, IoLogOutOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FiShoppingCart } from "react-icons/fi";
import { LiaUserCircle } from "react-icons/lia";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import axios from "axios";
import useSWR from "swr";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { CiMenuBurger } from "react-icons/ci";
import { useViewportSize } from "@mantine/hooks";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Nav = ({}) => {
  const { totalItems } = useCart();
  const { width } = useViewportSize();

  const router = useRouter();

  const [searchValue, setSearchValue] = useState([]);
  const [search, setSearch] = useState("");
  const ref = useClickOutside(() => setSearch(""));
  const [opened, { open, close }] = useDisclosure(false);
  const [openModal, setOpenModal] = useState(false);

  const { currentUser, isLoading, logout } = useAuth();

  const {
    data: prodData,
    error,
    mutate,
  } = useSWR(`/produit`, () =>
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit`)
  );

  // console.log(prodData);

  const searchData = (e) => {
    setOpenModal(true);

    if (openModal) {
      setSearch(e.target.value);
      const filteredDara = prodData?.data.filter((el) =>
        el.nom_produit.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchValue(filteredDara);
    }
  };

  let size = "40%";
  if (width < 1000) size = "90%";
  if (width < 500) size = "95%";

  return (
    <div className="nav" ref={ref}>
      <Drawer
        opened={opened}
        onClose={close}
        size={width < 481 ? "75%" : "40%"}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        transitionProps={{
          transition: "slide-right",
          duration: 400,
          // timingFunction: "ease-in-out",
        }}
      >
        <div className="drawer-content">
          <div className="logo">
            <Link href={"/"}>
              <Image
                src="/assets/img/logo-black.jpg"
                alt="logo diany's"
                width={100}
                height={28}
              />
            </Link>
          </div>
          <ul>
            <Link href={"/news"}>
              <li>Nouveauté</li>
            </Link>
            <Link href={"/solde"}>
              <li>Soldes</li>
            </Link>
            <Link href={"/products"}>
              <li>Produits</li>
            </Link>
            <Link href={"/"}>
              <li>Acceuil</li>
            </Link>
          </ul>

          <div className="diviser"></div>
          <Accordion
            padding={0}
            styles={{
              root: {},
              inner: { overflow: "hidden" },
              content: {
                padding: "0",
              },
              body: {},
            }}
            defaultValue="Chaussures"
          >
            <Accordion.Item value="Chaussures">
              <Accordion.Control>
                <h3>Chaussures</h3>
              </Accordion.Control>
              <Accordion.Panel>
                <ul>
                  <Link href={"/categories/chaussures/escarpin"}>
                    <li>Escarpin</li>
                  </Link>
                  <Link href={"/categories/chaussures/mules"}>
                    <li>Mules</li>
                  </Link>
                  <Link href={"/categories/chaussures/compensees"}>
                    <li>Compensées</li>
                  </Link>
                  <Link href={"/categories/chaussures/nu-pieds"}>
                    <li>Nu-pieds</li>
                  </Link>
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Accordion
            padding={0}
            styles={{
              root: {},
              inner: { overflow: "hidden" },
              content: {
                padding: "0",
              },
              body: {},
            }}
            defaultValue="compte"
          >
            <Accordion.Item value="compte">
              <Accordion.Control>
                <h3>Mon compte</h3>
              </Accordion.Control>
              <Accordion.Panel>
                <ul>
                  <Link href={"/products"}>
                    <Link
                      href="/dashboard/account"
                      style={{ color: "#202020" }}
                    >
                      <li>Compte</li>
                    </Link>
                  </Link>
                  <Link href={"/products"}>
                    <Link href="/dashboard/order" style={{ color: "#202020" }}>
                      <li>Commandes</li>
                    </Link>
                  </Link>
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          {/* <div className="diviser"></div> */}
        </div>
      </Drawer>

      <ul className={currentUser ? "userNav" : ""}>
        <div className="burger">
          <CiMenuBurger size={38} onClick={open} />
        </div>
        <div className="left-item">
          <div className="logo">
            <Link href={"/"}>
              <Image
                src="/assets/img/logo-black.jpg"
                alt="logo diany's"
                width={100}
                height={28}
              />
            </Link>
          </div>

          <Link href={"/products"}>
            <li className={router.pathname === "/products" ? "active" : ""}>
              produits
            </li>
          </Link>

          <Link href={"/categories/chaussures/escarpin"}>
            <li
              className={
                router.pathname === "/categories/chaussures/escarpin"
                  ? "active"
                  : ""
              }
            >
              Escarpin
            </li>
          </Link>
          <Link href={"/categories/chaussures/mules"}>
            <li
              className={
                router.pathname === "/categories/chaussures/mules"
                  ? "active"
                  : ""
              }
            >
              Mules
            </li>
          </Link>
          <Link href={"/categories/chaussures/compensees"}>
            <li
              className={
                router.pathname === "/categories/chaussures/compensees"
                  ? "active"
                  : ""
              }
            >
              Compensées
            </li>
          </Link>
          <Link href={"/categories/chaussures/nu-pieds"}>
            <li
              className={
                router.pathname === "/categories/chaussures/nu-pieds"
                  ? "active"
                  : ""
              }
            >
              Nu-pieds
            </li>
          </Link>

          <Link href={"/solde"}>
            <li className={router.pathname === "/solde" ? "active" : ""}>
              Soldes
            </li>
          </Link>

          <Link href={"/news"}>
            <li>Nouveautés</li>
          </Link>
        </div>

        <div className="right-item">
          <div className="search">
            <li className="search-bar">
              {width > 1300 ? (
                <TextInput
                  id="search-bar"
                  autoComplete="off"
                  leftSectionPointerEvents="none"
                  onChange={(e) => searchData(e)}
                  placeholder="Rechercher un produit"
                  leftSection={<IoSearchOutline className="search-icon" />}
                  onClick={() => setOpenModal(true)}
                />
              ) : (
                <span onClick={() => setOpenModal(true)}>
                  <IoSearchOutline className="search-icon" color="black" />
                </span>
              )}
            </li>
            <Modal
              opened={openModal}
              onClose={() => setOpenModal(false)}
              size={size}
              withCloseButton={false}
              radius="7"
              // p={0}
              overlayProps={{
                backgroundOpacity: 0.55,
                blur: 5,
              }}
              padding={0}
              yOffset={140}
              styles={{
                root: {
                  overflow: "hidden",
                },
                inner: { overflow: "hidden" },
                content: {
                  width: "100%",
                  // overflowX: "hidden",
                  // boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)",
                },
                body: { overflow: "hidden" },
              }}
            >
              {/* {search.length > 0 && ( */}

              <TextInput
                id="modal-search"
                autoComplete="off"
                leftSectionPointerEvents="none"
                onChange={(e) => searchData(e)}
                onBlur={() => console.log("ok")}
                placeholder="Rechercher un produit..."
                leftSection={
                  <IoSearchOutline className="search-icon" size={"1.3rem"} />
                }
                rightSection={
                  <RxCross2
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => setOpenModal(false)}
                  />
                }
                onClick={() => setOpenModal(true)}
              />
              <div
                className={
                  searchValue.length === 0
                    ? "search-container"
                    : "search-container scroll"
                }
              >
                {searchValue.length === 0 ? (
                  <p>Aucun produit trouvé.</p>
                ) : (
                  searchValue.map((prod) => (
                    <Link
                      href="produit/[id]"
                      as={`/produit/${prod.id}`}
                      key={prod.id}
                    >
                      <li className="search-card">
                        <Image
                          width={60}
                          height={60}
                          alt={"image " + prod.nom_produit}
                          loader={() => `${prod.image}`}
                          src={prod.image}
                          priority
                        />
                        <div className="left">
                          <h3>{prod.nom_produit}</h3>
                          <h4>{prod.prix} FCFA</h4>
                        </div>
                      </li>
                    </Link>
                  ))
                )}
              </div>
            </Modal>
            {/* )} */}
          </div>
          <Link href="/cart">
            <li className="shopping-cart">
              <FiShoppingCart />
              <span>{totalItems}</span>
            </li>
          </Link>
          {!currentUser?.data?.user ? (
            <Link href="/login">
              <li className="nav-account">
                {/* <TbLogin2 /> */}
                Connexion
              </li>
            </Link>
          ) : isLoading ? (
            <p>...</p>
          ) : (
            <li className="user-drop">
              <Menu shadow="md" width={220} radius={7}>
                <Menu.Target>
                  <Avatar radius="xl" color="#202020" variant="filled">
                    {currentUser?.data?.user.first_name[0].toUpperCase()}
                    {currentUser?.data.user.last_name.length > 0 &&
                      currentUser?.data?.user.last_name.toUpperCase()[0]}
                  </Avatar>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item className="drop-item no-hover">
                    <div className="drop-item no-hover">
                      <div>
                        <h3 style={{ margin: "0" }} className="user-name">
                          {currentUser?.data?.user.first_name +
                            " " +
                            currentUser?.data?.user.last_name}
                        </h3>
                        <span>{currentUser?.data?.user.email}</span>
                      </div>
                    </div>
                  </Menu.Item>
                  <Menu.Divider />

                  <Menu.Item
                    leftSection={
                      <LiaUserCircle
                        style={{ width: rem(18), height: rem(18) }}
                      />
                    }
                  >
                    <Link
                      href="/dashboard/account"
                      style={{ color: "#202020" }}
                    >
                      Votre compte
                    </Link>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <PiShoppingBagOpenLight
                        style={{ width: rem(18), height: rem(18) }}
                      />
                    }
                  >
                    <Link href="/dashboard/order" style={{ color: "#202020" }}>
                      Vos commandes
                    </Link>
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    onClick={logout}
                    leftSection={
                      <IoLogOutOutline
                        style={{ width: rem(18), height: rem(18) }}
                      />
                    }
                  >
                    Déconnexion
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </li>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Nav;
