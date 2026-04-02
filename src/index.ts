/**
 * DogsAPI MCP — wraps dogapi.dog v2 API (free, no auth)
 *
 * Tools:
 * - list_breeds: Get a paginated list of dog breeds
 * - get_breed: Get detailed information about a specific dog breed by ID
 * - list_facts: Get a list of random dog facts
 * - get_groups: Get all dog breed groups
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://dogapi.dog/api/v2';

// JSON:API style responses from dogapi.dog

type BreedAttributes = {
  name: string;
  description: string;
  life: { min: number; max: number };
  male_weight: { min: number; max: number };
  female_weight: { min: number; max: number };
  hypoallergenic: boolean;
};

type BreedResource = {
  id: string;
  type: string;
  attributes: BreedAttributes;
};

type BreedsResponse = {
  data: BreedResource[];
  links?: { self: string; next?: string; last?: string };
  meta?: { count: number };
};

type BreedResponse = {
  data: BreedResource;
};

type FactAttributes = {
  body: string;
};

type FactResource = {
  id: string;
  type: string;
  attributes: FactAttributes;
};

type FactsResponse = {
  data: FactResource[];
};

type GroupAttributes = {
  name: string;
};

type GroupResource = {
  id: string;
  type: string;
  attributes: GroupAttributes;
};

type GroupsResponse = {
  data: GroupResource[];
};

function formatBreed(b: BreedResource) {
  return {
    id: b.id,
    name: b.attributes.name,
    description: b.attributes.description,
    life_span_years: b.attributes.life,
    male_weight_kg: b.attributes.male_weight,
    female_weight_kg: b.attributes.female_weight,
    hypoallergenic: b.attributes.hypoallergenic,
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'list_breeds',
    description: 'Get a paginated list of dog breeds with details including weight, life span, and hypoallergenic status.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
        },
      },
    },
  },
  {
    name: 'get_breed',
    description: 'Get detailed information about a specific dog breed by its ID.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'The breed ID (obtained from list_breeds)',
        },
      },
      required: ['id'],
    },
  },
  {
    name: 'list_facts',
    description: 'Get a list of random dog facts.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of facts to return (default: 10, max: 100)',
        },
      },
    },
  },
  {
    name: 'get_groups',
    description: 'Get all dog breed groups (e.g., Sporting, Herding, Terrier).',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_breeds':
      return listBreeds((args.page as number | undefined) ?? 1);
    case 'get_breed':
      return getBreed(args.id as string);
    case 'list_facts':
      return listFacts((args.limit as number | undefined) ?? 10);
    case 'get_groups':
      return getGroups();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function listBreeds(page: number) {
  const res = await fetch(`${BASE_URL}/breeds?page[number]=${page}`);
  if (!res.ok) throw new Error(`Dogs API error: ${res.status}`);

  const data = (await res.json()) as BreedsResponse;
  return {
    page,
    total: data.meta?.count ?? null,
    breeds: data.data.map(formatBreed),
  };
}

async function getBreed(id: string) {
  const res = await fetch(`${BASE_URL}/breeds/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Dogs API error: ${res.status}`);

  const data = (await res.json()) as BreedResponse;
  return formatBreed(data.data);
}

async function listFacts(limit: number) {
  const res = await fetch(`${BASE_URL}/facts?limit=${limit}`);
  if (!res.ok) throw new Error(`Dogs API error: ${res.status}`);

  const data = (await res.json()) as FactsResponse;
  return {
    count: data.data.length,
    facts: data.data.map((f) => ({ id: f.id, fact: f.attributes.body })),
  };
}

async function getGroups() {
  const res = await fetch(`${BASE_URL}/groups`);
  if (!res.ok) throw new Error(`Dogs API error: ${res.status}`);

  const data = (await res.json()) as GroupsResponse;
  return {
    count: data.data.length,
    groups: data.data.map((g) => ({ id: g.id, name: g.attributes.name })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
