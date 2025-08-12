"use client";
import { useParams } from "next/navigation";
import React from "react";

const GamePage = () => {
  const params = useParams();
  const sport = params.sport as string;
  const webUrl = params.game as string;

  return (
    <>Game Page</>
  );
};

export default GamePage;
