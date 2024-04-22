import Head from "next/head";
import React from "react";

const Meta = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
};

// Meta.defaultProps = {
//   title: "Le Blod Dev, pour les passionnees du dev",
//   description:
//     "apprendre et comprendre le developpement , javascript , node js , reat ...",
// };

export default Meta;
