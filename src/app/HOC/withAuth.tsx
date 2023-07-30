import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthentication from "../hooks/useAutentication";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";

interface AuthenticatedProps {}

const withAuthentication = (
  WrappedComponent: React.ComponentType<AuthenticatedProps>
) => {
  const WithAuthenticationComponent: React.FC<AuthenticatedProps> = (props) => {
    const router = useRouter();
    const { getToken } = useAuthentication();
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthentication = () => {
      const token = getToken();

      if (!token) {
        router.push("/");
        toast.warning(
          "Você não está autenticado. Redirecionando para a página de login..."
        );
      } else {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      checkAuthentication();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthenticationComponent;
};

export default withAuthentication;
