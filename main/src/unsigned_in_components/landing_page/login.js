import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button class=" w-full h-full px-4 py-2 font-semibold text-gray-700  rounded-md hover:bg-gray-100" onClick={() => loginWithRedirect()}>Log In</button>;
};                      

export default LoginButton;