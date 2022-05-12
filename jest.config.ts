export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
