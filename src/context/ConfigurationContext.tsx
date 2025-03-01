import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getConfiguration } from "../services/api";

interface ConfigurationContextType {
  baseUrl: string;
  posterSize: string;
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

export const ConfigurationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [posterSize, setPosterSize] = useState<string>("w500");

  useEffect(() => {
    const fetchConfiguration = async () => {
      const config = await getConfiguration();
      setBaseUrl(config.images.secure_base_url);
      setPosterSize(
        config.images.poster_sizes.includes("w500")
          ? "w500"
          : config.images.poster_sizes[0]
      );
    };

    fetchConfiguration();
  }, []);

  return (
    <ConfigurationContext.Provider value={{ baseUrl, posterSize }}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider"
    );
  }
  return context;
};
