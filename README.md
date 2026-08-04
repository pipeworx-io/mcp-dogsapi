# mcp-dogsapi

DogsAPI MCP — wraps dogapi.dog v2 API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_breeds` | Search dog breeds with pagination. Returns breed names, IDs, weight ranges, life spans, and hypoallergenic status. Use get_breed for detailed info on a specific breed. |
| `get_breed` | Get detailed info about a dog breed by ID. Returns characteristics, temperament, origin, size, and health data. |
| `list_facts` | Get random dog facts. Returns interesting trivia about dog behavior, history, and abilities. |
| `get_groups` | Get all AKC dog breed groups (e.g., Sporting, Herding, Terrier). Returns group names and descriptions. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "dogsapi": {
      "url": "https://gateway.pipeworx.io/dogsapi/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Dogsapi data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
