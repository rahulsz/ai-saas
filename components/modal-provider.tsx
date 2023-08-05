"use client";

import { useEffect, useState } from "react";

import { ProModal } from "@/components/pro-modal";

export const ModalProvider = ( ) => {
    const [isMounted , SetIsMounted] = useState(false);

    useEffect(() => {
        SetIsMounted(true);
    }, []);

    if (!isMounted) {
      return null;
    }

    return (
        <>
         <ProModal/>
        </>
    )
}