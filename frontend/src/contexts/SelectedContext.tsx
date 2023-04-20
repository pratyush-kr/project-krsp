import { SelectedSchemeType } from "@/types/SelectedSchemeType";
import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

const selected_scheme: SelectedSchemeType = {
  normalCare: "",
  vipCare: "",
  premiumCare: "",
  set: (selectedScheme: SelectedSchemeType) => {},
  get: (key: string) => "",
};

export const SelectedContext = createContext<SelectedSchemeType>(selected_scheme);

export const SelectedContextProvider: React.FC<Props> = ({ children }) => {
  const [normalCareValue, setNormalCare] = useState<string>("");
  const [vipCareValue, setVipCare] = useState<string>("");
  const [premiumCareValue, setPremiumCare] = useState<string>("");
  const get = (key: string) => {
    if (key === "normalCare") {
      return normalCareValue;
    } else if (key === "vipCare") {
      return vipCareValue;
    } else if (key === "premiumCare") {
      return premiumCareValue;
    }
    return "KeyError";
  };
  const set = (selectedScheme: SelectedSchemeType) => {
    setNormalCare(selectedScheme.normalCare);
    setVipCare(selectedScheme.vipCare);
    setPremiumCare(selectedScheme.premiumCare);
  };
  return (
    <SelectedContext.Provider
      value={{
        normalCare: normalCareValue,
        vipCare: vipCareValue,
        premiumCare: premiumCareValue,
        set: set,
        get: get,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
};
