import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import  { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import Image from "next/image";


const Images = ({ imgData }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="image-container">
      <div className="product-imgs">
        <Swiper
          loop={true}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation, Thumbs]}
          grabCursor={true}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          className="product-images-slider"
          // className="mySwiper2"
        >
          {imgData?.map((item, index) => (
            <SwiperSlide key={index}>
              <Image
                src={item.image}
                alt="product images"
                width={400}
                height={700}
                loader={() => `${item.image}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={10}
          slidesPerView={4}
          modules={[FreeMode, Navigation, Thumbs]}
          className="product-images-slider-thumbs"
        >
          {imgData?.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                className={
                  activeIndex === index
                    ? "product-images-slider-thumbs-wrapper active-thumb"
                    : "product-images-slider-thumbs-wrapper"
                }
              >
                <Image
                  src={item.image}
                  alt="product images"
                  loader={() => `${item.image}`}
                  height={70}
                  width={50}
                  onClick={() => setActiveIndex(index)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Images;
