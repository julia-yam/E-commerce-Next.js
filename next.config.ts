import type {NextConfig} from "next";
import path from "path";
import type {Configuration, RuleSetRule} from "webpack";

interface CSSLoaderOptions {
  modules?: {
    exportLocalsConvention?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "front-school-strapi.ktsdev.ru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "front-school.minio.ktsdev.ru",
        pathname: "/**",
      },
    ],
  },

  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/shared/styles")],
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  webpack: (config: Configuration) => {
    const rules = config.module?.rules as RuleSetRule[] | undefined;

    if (!rules) return config;

    const ruleWithOneOf = rules.find(
      (rule) => rule && typeof rule === "object" && !!rule.oneOf,
    );

    if (ruleWithOneOf?.oneOf) {
      ruleWithOneOf.oneOf.forEach((rule) => {
        if (
          rule &&
          typeof rule === "object" &&
          "use" in rule &&
          Array.isArray(rule.use)
        ) {
          rule.use.forEach((moduleLoader) => {
            if (
              moduleLoader &&
              typeof moduleLoader === "object" &&
              "loader" in moduleLoader &&
              typeof moduleLoader.loader === "string" &&
              moduleLoader.loader.includes("css-loader") &&
              !moduleLoader.loader.includes("postcss-loader") &&
              "options" in moduleLoader && // проверяем наличие options
              typeof moduleLoader.options === "object" &&
              moduleLoader.options !== null
            ) {
              const options = moduleLoader.options as CSSLoaderOptions;

              if (options.modules) {
                options.modules.exportLocalsConvention = "camelCase";
              }
            }
          });
        }
      });
    }

    return config;
  },
};

export default nextConfig;
