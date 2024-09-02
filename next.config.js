const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  const env = {
    title: (() =>
      isDev
        ? 'EDUC - National Intelligence for Skills, Education, Employment and Entrepreneurship'
        : 'EDUC CUBE')(),
  };

  const images = {
    domains: ['images.unsplash.com', 'flagcdn.com'],
  };

  const rewrite = async () => {
    return [
      {
        source: '/hello',
        destination: 'learner',
      },
    ];
  };

  /**
   * Content-Security-Policy (CSP) is an HTTP header that allows a website to control and limit the types of resources
   * that can be loaded and executed on its pages.
   * Content-Security-Policy: default-src <trusted-domains>
   *
   * The X-Frame-Options header is an HTTP response header that allows a website to control whether or not
   * it can be displayed within an iframe on another domain.
   * Using "SAMEORIGIN," which allows the website to be embedded in iframes on pages with the same origin (same domain), but block other website.
   */
  const headers = async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self'",
          },
        ],
      },
    ];
  };

  const typescript = {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  };

  return {
    env,
    images,
    rewrite,
    typescript,
    headers,

    experimental: {
      externalDir: true,
    },
  };
};
