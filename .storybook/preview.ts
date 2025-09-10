import type { Preview } from '@storybook/nextjs'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Fast Form',
          [
            'Introduction',
            'Design Tokens',
          ],
          'Form Creation',
          [
            'Upload Components',
            'Form Editor',
            'Form Templates',
            'Analytics',
            'Form Creation Guide',
          ],
          'Features',
          [
            'Dashboard Components',
            'Brand Components',
          ],
          'Components',
          [
            'Button',
            'Header',
            'Page',
          ],
        ],
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },
  },
};

export default preview;