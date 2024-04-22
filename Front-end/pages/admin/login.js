import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { Button, TextInput } from "@mantine/core";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { useViewportSize } from "@mantine/hooks";

import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const SignInForm = () => {
  const [showMdp, setShowMdp] = useState(false);
  const { width } = useViewportSize();

  const [loading, setLoading] = useState(false);

  const { login } = useAuth({
    middleware: "admin",
  });

  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // e.preventDefault();

    try {
      setLoading(true);
      const res = await login(data.email, data.password);

      setLoading(false);
    } catch (error) {
      toast.error("Adresse mail ou mot de passe incorrect !");
    } finally {
      setLoading(false);
    }
  };

  // console.log(currentUser?.data);

  return (
    <div className={"register"}>
      <Head>
        <title>Se connecter</title>
        <meta
          name="description"
          content="Connectez-vous à votre compte Diany's Boutique. Profitez d'une expérience de shopping personnalisée et accédez à des offres exclusives."
        />
      </Head>
      <Toaster richColors position="top-right" />
      <div className="content">
        <div className="logo">
          <Link href={"/"}>
            <Image
              src="/assets/img/logo-orange.png"
              alt="logo"
              height={40}
              width={100}
            />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-item">
            <TextInput
              label="Email"
              // {...form.getInputProps("email")}
              withAsterisk
              placeholder="Entrer votre adresse mail"
              {...register("email", {
                required: "Vous devez saisir votre adresse e-mail.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Vous devez saisir une adresse e-mail correcte.",
                },
              })}
              onChange={() => errors.email && clearErrors("email")}
            />
            {errors.email && (
              <div className="error">
                <span>
                  <MdError />
                </span>
                <p>{errors.email?.message}</p>
              </div>
            )}
          </div>

          <div className="form-item">
            <TextInput
              id="mdp"
              placeholder="Entrer votre mot de passe"
              label=" mot de passe"
              {...register("password", {
                required: "Vous devez saisir votre passe.",
              })}
              onChange={() => errors.password && clearErrors("password")}
              withAsterisk
              type={showMdp ? "text" : "password"}
              rightSection={
                showMdp ? (
                  <AiOutlineEye
                    onClick={() => setShowMdp(!showMdp)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    onClick={() => setShowMdp(!showMdp)}
                    style={{ cursor: "pointer" }}
                  />
                )
              }
            />
            {errors.password && (
              <div className="error">
                <span>
                  <MdError />
                </span>
                <p>{errors.password?.message}</p>
              </div>
            )}
          </div>

          <div>
            <Button type="submit" loading={loading}>
              Se connecter
            </Button>
          </div>
          <div className="bottom">
            <p>
              {width >= 692 && "pas encore de compte ? "}
              <Link href={"/register"}>S&apos;inscrire</Link>
            </p>
            <p className="restore-mdp">Renitialiser mot de passe</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
