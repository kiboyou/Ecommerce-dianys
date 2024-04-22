import React from "react";
import { RiSearchLine } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { Drawer, TextInput } from "@mantine/core";
import { RxHamburgerMenu } from "react-icons/rx";
import { useViewportSize } from "@mantine/hooks";
import { useDisclosure } from "@mantine/hooks";
import { RxDashboard } from "react-icons/rx";
import { BsHandbag } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

const AdminTopBar = () => {
  const { width } = useViewportSize();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="top">
      <Drawer
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size={"80%"}
        overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
        transitionProps={{
          transition: "slide-right",
          duration: 400,
          // timingFunction: "ease-in-out",
        }}
        styles={{
          root: {
            overflow: "hidden",
          },
          inner: {},
          content: {
            width: "100%",
            // overflowX: "hidden",
            // boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.5)",
            background: "#202020",
          },
          body: { overflow: "hidden" },
        }}
      >
        {" "}
        <div className="sidebar-mobile">
          <span onClick={close} className="close">
            <MdClose color="white" size={"1.3rem"} />
          </span>
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
      </Drawer>
      <div className="left">
        {width < 1200 && <RxHamburgerMenu size={"2rem"} onClick={open} />}

        <div className="search">
          <TextInput
            leftSection={<RiSearchLine color="#202020" size={"1.2rem"} />}
            placeholder="Rechercher"
          />
        </div>
      </div>
      <div className="right">
        <span className="icon">
          <IoNotificationsOutline />
          {/* <p>{notifications ? notifications.length : 0}</p> */}
        </span>
        <span className="user">RS</span>
      </div>
    </div>
  );
};

export default AdminTopBar;
