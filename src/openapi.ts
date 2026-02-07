export const openapiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Medication Inventory REST API',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000/api' }],
  paths: {
    '/medications': {
      get: {
        summary: 'List medications',
        parameters: [
          {
            name: 'schedule',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['II', 'III', 'IV', 'V'] },
          },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
    '/medications/{id}': {
      get: {
        summary: 'Get medication with transaction history',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'OK' }, '404': { description: 'Not found' } },
      },
    },
    '/transactions': {
      get: {
        summary: 'List transactions',
        parameters: [
          {
            name: 'type',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['CHECKOUT', 'RETURN', 'WASTE'] },
          },
          { name: 'medicationId', in: 'query', required: false, schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
      post: {
        summary: 'Create transaction',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['medicationId', 'nurseId', 'witnessId', 'type', 'quantity'],
                properties: {
                  medicationId: { type: 'integer' },
                  nurseId: { type: 'integer' },
                  witnessId: { type: 'integer' },
                  type: { type: 'string', enum: ['CHECKOUT', 'RETURN', 'WASTE'] },
                  quantity: { type: 'integer' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Created' }, '400': { description: 'Bad request' } },
      },
    },
    '/audit-log': {
      get: {
        summary: 'List audit log entries',
        parameters: [
          { name: 'entityType', in: 'query', required: false, schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'OK' } },
      },
    },
  },
} as const;
