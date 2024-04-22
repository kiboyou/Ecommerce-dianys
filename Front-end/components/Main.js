import { Button } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import AOS from "aos";
import "aos/dist/aos.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const Main = () => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div className="main">
      {/* <div className="header">
        <div className="header-left">
          <h1>
            La mode féminine de qualité. <br /> <span>Vêtements</span>,{" "}
            <span>Chaussures</span> et<span> Accessoires</span>
          </h1>
          <Link href="/products">
            <Button radius={"0"}>ACHETER MAINTENANT</Button>
          </Link>
        </div>
        <div className="header-right">
          <div className="img-container">
            <Image
              src="/assets/img/main-img.png"
              alt="image robe dianys"
              priority
              className="main-img"
              width={400}
              height={500}
            />
          </div>
        </div>
      </div> */}
      <Image
        src="/assets/img/banner-3.jpg"
        width={1200}
        height={500}
        data-aos="fade-up"
        data-aos-duration="2000"
        data-aos-anchor-placement="center-bottom"
      />
      {/* <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Image src="/assets/img/banner-1.jpg" width={1200} height={500} />
        </SwiperSlide>
        <SwiperSlide>
          <Image src="/assets/img/banner-2.jpg" width={1200} height={500} />
        </SwiperSlide>
      </Swiper> */}
    </div>
  );
};

export default Main;
