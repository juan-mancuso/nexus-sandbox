/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Logger } from "../utils/logger";

export type AppEnv = "production" | "staging" | "development";

export interface AppConfigType {
  env: AppEnv;
  debug: boolean;
  userAgent: string;
  apiUrl: string; // resolved primary API url (may point to secure or standard depending on usage)
}

const apiUrls: Record<string, { standard: string; secure: string }> = {
  production: {
    standard: "https://api.bamboopayment.com",
    secure: "https://secure-api.bamboopayment.com",
  },
  staging: {
    standard: "https://api.bamboopayment.com",
    secure: "https://secure-api.bamboopayment.com",
  },
  development: {
    standard: "https://api.bamboopayment.com",
    secure: "https://secure-api.bamboopayment.com",
  },
};

let globalConfig: AppConfigType = {
  env: "production",
  debug: false,
  userAgent: "BambooPayment-SDK/1.0.0",
  apiUrl: apiUrls.production.standard,
};

export function getAppConfig(): AppConfigType {
  return { ...globalConfig };
}

export function setAppConfig(config: Partial<AppConfigType>): void {
  globalConfig = { ...globalConfig, ...config };
  Logger.info({ msg: "AppConfig updated", config: globalConfig });
}

export function resolveApiUrl(useSecureApi = false): string {
  const env = globalConfig.env || "production";
  const entry = apiUrls[env] || apiUrls.production;
  return useSecureApi ? entry.secure : entry.standard;
}

export { apiUrls };
