import { Button } from "@mantine/core";
import Image from "next/image";
import React from "react";

const SalesBanner = () => {
  return (
    <div className="salesBanner">
      <div className="content">
        <div className="left">
          <h1>Profitez des articles en promotion</h1>
          <Button radius={0}>PROFITER MAINTENANT</Button>
        </div>
        <div className="right">
          <div className="img-container">
            <Image
              src="/assets/img/img-sales-banner.jpg"
              width={300}
              height={450}
              alt="image chaussure dianys"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesBanner;
