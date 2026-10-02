import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {themes as prismThemes} from 'prism-react-renderer';

const config: Config = {
  title: 'Soroban Docs',
  tagline: 'Soroban Documentation',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://soroban.stellar.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub Pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'stellar', // Usually your GitHub org/user name.
  projectName: 'soroban-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your content is created in EN only,
  // English will be the default locale.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" functionality.
          editUrl: 'https://github.com/stellar/soroban/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            types: ['rss'],
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" functionality.
          editUrl: 'https://github.com/stellar/soroban/tree/main/docs/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Soroban',
      logo: {
        alt: 'Soroban Logo',
        src: 'img/soroban-logo-light.svg',
        srcDark: 'img/soroban-logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/stellar/soroban',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Media Kit',
              to: '/docs/media-kit',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stellar Forum',
              href: 'https://forum.stellar.org',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/stellar',
            },
            {
              label: 'Twitter / X',
              href: 'https://twitter.com/StellarOrg',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/stellar/soroban',
            },
            {
              label: 'Stellar Website',
              href: 'https://stellar.org',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Stellar Development Foundation. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
