'use client'

import { ReactNode, useState } from "react";

export const Provider = ({ children }: { children: ReactNode }) => {
  const [client] = useState()

  return <div>Provider</div>;
};
