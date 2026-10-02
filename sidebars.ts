import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a docs item as an `<iframe>`
 - create a "authors" component for an author's bio
 - ensure that the docs sidebar has a default entry for every version string
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar for the docs folder
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'getting-started/introduction',
      },
      items: [
        'getting-started/installation',
        'getting-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Building Contracts',
      link: {
        type: 'doc',
        id: 'building-contracts/introduction',
      },
      items: [
        'building-contracts/smart-contracts',
        'building-contracts/rust-setup',
        'building-contracts/writing-contracts',
        'building-contracts/testing-contracts',
      ],
    },
    {
      type: 'category',
      label: 'Interacting with Contracts',
      link: {
        type: 'doc',
        id: 'interacting-with-contracts/introduction',
      },
      items: [
        'interacting-with-contracts/cli',
        'interacting-with-contracts/js-sdk',
        'interacting-with-contracts/rust-sdk',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      link: {
        type: 'doc',
        id: 'advanced-topics/introduction',
      },
      items: [
        'advanced-topics/oracles',
        'advanced-topics/token-standards',
      ],
    },
    {
      type: 'link',
      label: 'Media Kit',
      href: '/docs/media-kit',
      position: 'bottom',
    },
  ],
};

export default sidebars;
