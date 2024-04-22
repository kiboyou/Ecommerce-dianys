import { Button, TextInput } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import Head from "next/head";

// ...

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [first_name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showMdp, setShowMdp] = useState(false);
  const [showMdp2, setShowMdp2] = useState(false);

  const router = useRouter();
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();

  const data = {
    email,
    first_name,
    password,
    confirmPassword,
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/utilisateur/CreationUtilisateur/`,
          data
        )
        .then(() => toast.success("Votre compte a bien été crée !"))
        .then(() => mutate() && router.push("/login"));

      console.log(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Cette adresse mail est déjà utilisée !");
      console.log(error);
      setLoading(false);
    }
  };

  console.log(errors);

  return (
    <div className="register">
      <Head>
        <title>Creer un compte</title>
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
              label="Nom"
              {...register("last_name", {
                required: "Vous devez saisir votre nom",
              })}
              onChange={() => errors.last_name && clearErrors("last_name")}
              // className={errors.first_name ? "input_error" : null}
              withAsterisk
              placeholder="Entrer votre nom"
            />
            {errors.last_name && (
              <div className="error">
                <span>
                  <MdError />
                </span>
                <p>{errors.last_name?.message}</p>
              </div>
            )}
          </div>
          <div className="form-item">
            <TextInput
              label="Prenom(s)"
              {...register("first_name", {
                required: "Vous devez saisir votre Prenom",
              })}
              onChange={() => errors.first_name && clearErrors("first_name")}
              // className={errors.first_name ? "input_error" : null}
              withAsterisk
              placeholder="Entrer votre prenom"
            />
            {errors.first_name && (
              <div className="error">
                <span>
                  <MdError />
                </span>
                <p>{errors.first_name?.message}</p>
              </div>
            )}
          </div>

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
              placeholder="Creer un mot de passe"
              label=" mot de passe"
              // {...form.getInputProps("password")}
              {...register("password", {
                required: "Vous devez saisir un mot de passe.",
                pattern: {
                  value: /^(?:\S{8,})$/,
                  message: "Vous devez choisir un mot de passe plus long",
                },
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
          <div className="form-item">
            <TextInput
              placeholder="Confirmer le mot de passe"
              label="Confirmer le mot de passe"
              withAsterisk
              // {...form.getInputProps("confirmPassword")}
              {...register("confirmPassword", {
                required: "Vous devez confirmer le mot de passe",
                validate: (val) => {
                  if (watch("password") != val) {
                    return "Les mots de passes de correnpondent pas";
                  }
                },
              })}
              onChange={() =>
                errors.confirmPassword && clearErrors("confirmPassword")
              }
              type={showMdp2 ? "text" : "password"}
              rightSection={
                showMdp2 ? (
                  <AiOutlineEye
                    onClick={() => setShowMdp2(!showMdp2)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    onClick={() => setShowMdp2(!showMdp2)}
                    style={{ cursor: "pointer" }}
                  />
                )
              }
            />
            {errors.confirmPassword && (
              <div className="error">
                <span>
                  <MdError />
                </span>
                <p>{errors.confirmPassword?.message}</p>
              </div>
            )}
          </div>

          <div>
            {/* <input type="submit" value="S'inscrire" /> */}
            <Button type="submit" loading={isLoading}>
              S&apos;inscrire
            </Button>
          </div>

          <div className="bottom"></div>

          <p className="register-bottom">
            Vous avez déjà un compte ?{" "}
            <Link href={"/login"}> Connectez-vous</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
