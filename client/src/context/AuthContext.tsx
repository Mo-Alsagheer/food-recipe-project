import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "LOADED" };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
};

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return { user: action.payload.user, token: action.payload.token, loading: false };
    case "LOGOUT":
      localStorage.removeItem("token");
      return { user: null, token: null, loading: false };
    case "LOADED":
      return { ...state, loading: false };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (token && stored) {
      try {
        const user = JSON.parse(stored) as User;
        dispatch({ type: "LOGIN", payload: { user, token } });
      } catch {
        dispatch({ type: "LOADED" });
      }
    } else {
      dispatch({ type: "LOADED" });
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
