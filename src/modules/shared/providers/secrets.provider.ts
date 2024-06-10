import { FactoryProvider } from "@nestjs/common";
import { AppEnvironment } from "../enums/app-environment.enum";

export const SecretsProviders: FactoryProvider[] = Object.values(
    AppEnvironment,
  ).map((key: AppEnvironment): FactoryProvider => {
    return {
      provide: key,
      useFactory: async (): Promise<string> => {
        return process.env[key];
      },
    };
  });