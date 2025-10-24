/** @type {import('next').NextConfig} */
module.exports = {
  // Add webpack rule to handle .html imports (some native deps include HTML files)
  webpack(config) {
    config.module.rules.push({
      test: /\.html$/i,
      type: 'asset/source',
    });
    return config;
  },
}
