"use server";

import { signIn } from "next-auth/react";

export async function handleLoginAction(formData: FormData) {
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
    provider: "credentials",
  };
  console.log(credentials);

  const result = await signIn("credentials", {
    ...credentials,
    redirect: false,
  });

  console.log(result);
}
