// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// export default {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   // clearMocks: true,
//   // coverageProvider: "v8",
//   // moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

//   // roots: ["<rootDir>/src"],

//   // testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
//   // transform: {
//   //   "^.+\\.(ts|tsx)$": "ts-jest",
//   // },
// };

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
