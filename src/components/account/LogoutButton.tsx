import { signOut } from "next-auth/react";

function LogoutButton() {
  return (
    <span
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </span>
  );
}

export default LogoutButton;
