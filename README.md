# ShopVerse — Dynamic Shopping Website (with Node.js/Express backend)

A shopping demo site originally built with HTML/CSS/Bootstrap/JavaScript, now
backed by a Node.js + Express REST API.

## Stack

- **Frontend:** `public/` (HTML, CSS, **Bootstrap 5**, JavaScript)
- **Backend:** Node.js + Express (`server.js`)
- **Database:** MySQL — database `shopverse`, user `root` with **no password**
  (tables and seed data are created automatically on first start)

## Getting started

### 1. One-time MySQL setup

On Ubuntu, MySQL's root uses `auth_socket` by default, which Node cannot use.
Run the provided script once (it asks for *your* Linux password):

```bash
sudo bash setup-db.sh
```

### 2. Install & run

```bash
npm install      # install dependencies (express, cors, mysql2, jsdom)
npm start        # bootstrap the DB, then serve on http://localhost:3000
```

On first start the server automatically creates the `shopverse` database, its
tables and the seed data (**20 products with real photos**, shops, categories,
offers). Then open <http://localhost:3000>.

> The page must be opened through the Express server — not with Live Server
> or by double-clicking `index.html` — otherwise the API calls fail and a red
> banner explains it.

Connection settings can be overridden with env vars:
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`.

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