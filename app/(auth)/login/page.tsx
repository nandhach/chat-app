"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoMail } from "react-icons/io5";
import useDebounce from "@/hooks/useDebounce";
import { FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { handleLoginAction } from "@/service/login";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidated, setIsValidated] = useState(false);

  const debouncedEmail = useDebounce({ value: email, delay: 500 });

  useEffect(() => {
    if (debouncedEmail) {
      setIsValidated(validateEmail(debouncedEmail));
    } else {
      setIsValidated(false);
    }
  }, [debouncedEmail]);

  return (
    <>
      <div className="w-3/5 flex-col flex justify-center">
        <div className="flex flex-col gap-6 scale-75">
          <div className="h-28 w-28 rounded-lg bg-slate-500"></div>
          <div className="flex-col gap-6">
            <div className="flex gap-2">
              <div className="text-2xl font-bold">Login</div>
              <div className="text-2xl text-red-500 font-bold">NKRI</div>
            </div>
            <div className="opacity-50">Masuk untuk melanjutkan</div>
          </div>
          <form action={handleLoginAction} className="flex flex-col gap-4">
            <Input name="email" type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} placeholder="Alamat Email atau Nomor Telepon" icon={<IoMail />} />
            <Input name="password" type="password" defaultValue={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password harus lebih dari 8 karakter" icon={<IoMail />} />
            <Button disabled={!isValidated} variant="primary" size={"default"}>
              <div>Masuk</div>
            </Button>
          </form>
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="absolute px-4 bg-white text-sm">Atau</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button variant={"secondary"} size={"default"}>
            <div className="flex items-center gap-2">
              <Image alt="Google" src="/google.svg" width={25} height={25} />
            </div>
            <div className="font-semibold">Masuk dengan Google</div>
          </Button>
          <Button variant={"black"} size={"default"}>
            <div className="flex items-center gap-2">
              <FaApple size={24} />
              <div className="font-semibold">Masuk dengan Apple</div>
            </div>
          </Button>
          <div className="flex justify-center gap-2 text-sm">
            Tidak punya akun?{" "}
            <Link href="/register" className="text-red-500 font-semibold">
              Buat Akun
            </Link>
          </div>
        </div>
      </div>
      <div className="w-3/5 h-full">
        <Image className="w-full h-full  rounded-2xl" alt="Background-candi" src="/candi-login.svg" width={400} height={400} />
      </div>
    </>
  );
};

export default LoginPage;
