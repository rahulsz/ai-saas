"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("726b342e-e0ff-4d34-a00d-02f5de49ff5f");
  }, []);

  return null;
};