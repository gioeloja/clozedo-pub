import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const RegisterButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="w-full h-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
      onClick={() => loginWithRedirect({ screen_hint: "signup" })}
    >
      Register
    </button>
  );
};

export default RegisterButton;
