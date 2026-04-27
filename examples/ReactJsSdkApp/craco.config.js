module.exports = {
    eslint: {
        configure: (eslintConfig) => {
            // Remove the options that cause the crash
            delete eslintConfig.extensions;
            delete eslintConfig.resolvePluginsRelativeTo;

            return eslintConfig;
        },
    },
};