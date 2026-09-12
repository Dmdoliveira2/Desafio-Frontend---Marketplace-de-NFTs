import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { fetchSession, type User } from "../api/auth";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("kurio-token"),
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchSession()
      .then(({ user }) => setUser(user))
      .catch(() => {
        setToken(null);
        localStorage.removeItem("kurio-token");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  function setAuth(newToken: string, newUser: User) {
    localStorage.setItem("kurio-token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function clearAuth() {
    localStorage.removeItem("kurio-token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, setAuth, clearAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return context;
}
