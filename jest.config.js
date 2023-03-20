module.exports = {
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
            // enable esModuleInterop for ts-jest
            isolatedModules: true,
            tsConfig: {
                esModuleInterop: true
            }
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "**/test/**/*.test.(ts|js)"
    ],
    testEnvironment: "node"
};
