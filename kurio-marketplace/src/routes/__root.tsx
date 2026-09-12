import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { useSocket } from "../lib/useSocket";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useSocket();

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
