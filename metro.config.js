const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const defaultResolveRequest = config.resolver.resolveRequest;
const asyncStorageEntry = require.resolve('@react-native-async-storage/async-storage/lib/module/index.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@react-native-async-storage/async-storage') {
    return {
      filePath: asyncStorageEntry,
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
