import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<any>(null);

const AuthProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [token, setToken] = useState<string | null>(null);

  // Récupérer le token au chargement de l'application
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };
    fetchToken();
  }, []);

  // Fournir le token et une fonction pour mettre à jour
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Utilitaire pour accéder au contexte
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
