import React from "react";
import { Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const HomeButton = () => {
  const router = useRouter();
  const handleHomeClick = () => {
    router.push("/dashboard");
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<Home />}
      onClick={handleHomeClick}
    >
      Home
    </Button>
  );
};

export default HomeButton;
