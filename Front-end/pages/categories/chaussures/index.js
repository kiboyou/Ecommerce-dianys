import Card from "@/components/Card";
import CategoriesLayout from "@/layouts/CategoriesLayout";
import { Button } from "@mantine/core";
import React from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Shoes = ({ test }) => {
  //   console.log(test);

  const {
    data: products,
    error,
    mutate,
  } = useSWR(`/produit`, () =>
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/produit`)
  );

  //   console.log(prodData);

  return <CategoriesLayout></CategoriesLayout>;
};

export default Shoes;
