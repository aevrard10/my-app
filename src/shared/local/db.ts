// Lazy require to avoid importing expo-sqlite in web bundles.
import { Platform } from "react-native";

type Impl = {
  execute: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  executeVoid: (sql: string, params?: any[]) => Promise<void>;
  runMigrations: () => Promise<void>;
};

let impl: Impl;
if (Platform.OS === "web") {
  impl = require("./db.web");
} else {
  impl = require("./db.native");
}

export const execute = impl.execute;
export const executeVoid = impl.executeVoid;
export const runMigrations = impl.runMigrations;

