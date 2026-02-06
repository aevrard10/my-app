import AsyncStorage from "@react-native-async-storage/async-storage";
import QueriesKeys from "@shared/declarations/queriesKeys";
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
  const [isReady, setIsReady] = useState(false);

  // Récupérer le token au chargement de l'application
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem(QueriesKeys.USER_TOKEN);
      if (storedToken) {
        setToken(storedToken);
      }
      setIsReady(true);
    };
    fetchToken();
  }, []);

  // Fournir le token et une fonction pour mettre à jour
  return (
    <AuthContext.Provider value={{ token, setToken, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

// Utilitaire pour accéder au contexte
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
