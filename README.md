# mcp-dogsapi

MCP server for dog breed details and facts via [dogapi.dog](https://dogapi.dog). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `list_breeds` | Get a paginated list of dog breeds with weight, life span, and more |
| `get_breed` | Get detailed information about a specific dog breed by ID |
| `list_facts` | Get a list of random dog facts |
| `get_groups` | Get all dog breed groups (e.g., Sporting, Herding, Terrier) |

## Quickstart via Pipeworx Gateway

Call any tool through the hosted gateway with zero setup:

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "dogsapi_list_facts",
      "arguments": { "limit": 5 }
    }
  }'
```

## License

MIT
