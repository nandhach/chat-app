"use client";

import Image from "next/image";
import React from "react";

type Props = {
  size?: number;
};

const LoadingLogo = ({ size = 200 }: Props) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Image src="\logo.svg" alt="logo" width={size} height={size} className="animate-pules duration-100" />
    </div>
  );
};

export default LoadingLogo;
