# ShopVerse — Dynamic Shopping Website (with Node.js/Express backend)

A shopping demo site originally built with HTML/CSS/Bootstrap/JavaScript, now
backed by a Node.js + Express REST API.

## Stack

- **Frontend:** `public/` (HTML, CSS, **Bootstrap 5**, JavaScript)
- **Backend:** Node.js + Express (`server.js`)
- **Data:** In-memory store in `data/db.js` (products, shops, categories,
  offers, orders)

## Getting started

```bash
npm install      # install dependencies (express, cors, jsdom for tests)
npm start        # start the server on http://localhost:3000
```

The frontend at `http://localhost:3000/` now loads all its data (products,
shops, categories, offers) from the API via `fetch()`.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products. Query params: `search`, `category`, `shop`, `maxPrice`, `minRating` |
| GET | `/api/products/:id` | One product |
| GET | `/api/shops` | List shops |
| GET | `/api/categories` | List categories |
| GET | `/api/offers` | List offers |
| POST | `/api/orders` | Place an order `{ items: [{id, qty}], customer: {name, email} }` |
| GET | `/api/orders` | List placed orders (debug) |
| GET | `/api/health` | Health check |

### Examples

```bash
curl 'http://localhost:3000/api/products?category=Electronics'
curl http://localhost:3000/api/products/3

curl -X POST http://localhost:3000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"items":[{"id":2,"qty":2}],"customer":{"name":"Ada","email":"ada@example.com"}}'
```

## Tests

```bash
# Start the server first, then:
npm test
```

`test-smoke.js` loads the frontend in jsdom, confirms that data is fetched from
the API and rendered, and places a real order through the checkout flow.

## Notes

- Orders are kept in memory and reset when the server restarts.
- The dev script `npm run dev` uses `node --watch` (Node 18+) for auto-restart.