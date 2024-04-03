/* eslint-disable @typescript-eslint/naming-convention */
// @ts-nocheck
/* eslint-disable comma-dangle */
/* eslint-disable semi */
const path = require("path")

const modulePath = (dir) => {
  return path.join(__dirname, dir)
}

const MODULES = [
  "screens",
  "api-client",
  "components",
  "stacks",
  "hooks",
  "assets",
  "graphql",
  "lib",
  "core-auth",
  "core-event-details",
  "core-root",
  "location",
  "modules",
  "content-parsing",
  "date-time",
  "test-helpers",
  "core-content-reporting",
  "shared-models",
  "notifications",
  "core-explore-events",
  "arrival-tracking",
  "core-location-search"
]

module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        { moduleName: "@env", path: ".env", safe: true }
      ],
      ["@babel/plugin-transform-flow-strip-types"],
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      [
        "module-resolver",
        {
          alias: Object.fromEntries(
            MODULES.map((module) => [`@${module}`, modulePath(module)])
          ),
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      ],
      ["react-native-reanimated/plugin"]
    ]
  }
}
