export default {
  type: 'object',
  properties: {
    data: { type: 'array' },
  },
  required: ['data'],
} as const;
