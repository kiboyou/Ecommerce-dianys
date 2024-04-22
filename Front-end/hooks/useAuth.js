import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export const useAuth = ({ middleware, redirectIfAuth } = {}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: currentUser,
    error,
    mutate,
  } = useSWR(`/api/account/user`, () => axios.get("/api/account/user"));

  const login = async (email, password) => {
    const body = JSON.stringify({
      email,
      password,
    });

    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body,
      });

      // console.log(res);

      if (res.status === 200) {
        router.push("/");
      } else {
        throw new Error("Login failed with status: " + res.status);
      }

      return res.status === 401;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //refresh
  const refresh = async () => {
    try {
      const res = await fetch("/api/account/refresh", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  //logout
  const logout = async () => {
    try {
      const res = await fetch("/api/account/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      });
      // console.log(res);
      mutate(null);

      if (res.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser?.data?.user || error) {
      setIsLoading(false);
    }
    // refresh();

    // if (
    //   middleware === "admin" &&
    //   !currentUser &&
    //   currentUser.data &&
    //   currentUser.data.length > 0
    // ) {
    //   const user = currentUser.data[0];
    //   if (user.is_superuser) {
    //     router.push("/admin");
    //   }
    // }

    if (middleware == "guest" && currentUser) router.push("/");
    if (middleware == "auth" && !currentUser && error) router.push("/login");
    // if (middleware === "admin" && !currentUser?.data?.user?.is_superuser)
    //   router.push("/admin/login");
    // if (middleware === "admin" && currentUser?.data?.user?.is_superuser)
    //   router.push("/admin/dashboard");

    // console.log(currentUser);
  }, [currentUser, error, isLoading]);

  return {
    currentUser,
    login,
    refresh,
    logout,
    isLoading,
  };
};

export default useAuth;
