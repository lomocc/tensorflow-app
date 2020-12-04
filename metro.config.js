const { assetExts } = require('metro-config/src/defaults/defaults');

module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
  resolver: {
    assetExts: [...assetExts, 'bin'],
  },
};
