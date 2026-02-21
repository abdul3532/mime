  
**MIME**

Product Requirements Document

Claude Code Implementation Guide · Hackathon Edition

*Version 1.0 · February 2026 · Confidential*

| *This PRD is written specifically for Claude Code to implement MIME end-to-end. Every section contains explicit file paths, function signatures, data schemas, API contracts, and acceptance criteria. Claude Code should treat this document as the single source of truth for what to build, how to build it, and how to verify it works.* |
| :---- |

# **1\. Product Overview**

MIME is the navigation layer for the agent economy. As consumers increasingly send AI agents to shop on their behalf — via ChatGPT, Perplexity, or any AI shopping assistant — those agents struggle to navigate standard e-commerce stores efficiently. MIME solves this by deploying a structured, intelligent store agent on the brand side that understands agent intent, surfaces the most relevant products, and returns structured responses optimised for conversion — not for storytelling.

MIME does three things simultaneously: (1) makes stores navigable and queryable by AI shopping agents, (2) returns structured product data optimised to convert the buyer, and (3) captures the structured intent data from every agent interaction — real budgets, real preferences, real constraints — that no retailer has ever had access to before.

The hackathon MVP demonstrates this full loop: store connects via product feed or CSV → agent deployed → consumer agent queries it → structured recommendations returned → intent data captured.

## **1.1 The One-Line Value Proposition**

MIME makes your store navigable for AI agents — so they convert.

## **1.2 What We Are NOT Building (Hackathon Scope)**

* No web crawling — stores connect via product feed (CSV, Google Shopping, or Shopify /products.json)

* No brand persona configuration — the agent's goal is conversion, not brand voice

* No user authentication or multi-tenancy (single demo store only)

* No real payment processing or checkout flow

* No database persistence between sessions (in-memory is fine)

* No negotiation layer

# **2\. The Three Core Pillars**

## **2.1 Pillar 1 — AI Store Agent (Conversion-Focused)**

MIME deploys a live AI agent that acts as the store's structured interface for the agentic commerce world. When a consumer's AI agent arrives with a shopping intent — budget, category, delivery constraints — the MIME agent understands it, reasons about it, and responds with the right products in a structured format optimised for conversion.

This is not a chatbot. It is not a brand storytelling tool. It is a conversion engine: it maps agent intent to the most relevant in-stock products, applies budget and constraint filters, and returns ranked recommendations with clear rationales. Personality and tone are intentionally deprioritised — clarity and relevance drive conversion.

## **2.2 Pillar 2 — Seller Merchandising Controls**

Sellers control how the agent navigates their catalogue. Through the MIME admin panel they define: which categories to prioritise, which products to pin, what to do when no good match exists, and what products to exclude. These are merchandising rules, not brand rules — they exist to maximise the chance of a relevant recommendation reaching the buyer.

## **2.3 Pillar 3 — Intent Data Intelligence**

Every agent interaction generates structured intent data that no retailer has ever had access to before. Not clicks. Not page views. Actual declared intent: the buyer's exact budget before they committed, their precise constraints, their delivery deadline, what they explicitly ruled out. MIME captures all of this and surfaces it in the seller dashboard as actionable intelligence: gap analysis, budget distribution, trending queries, conversion drop-off.

# **3\. Seller Admin Panel — Full Specification**

The admin panel has four sections.

## **3.1 Store Connection**

How product data gets into MIME. Three tiers — no web crawling in any tier:

| Tier | How it works | Best for |
| :---- | :---- | :---- |
| CSV Upload | Upload a product CSV. MIME parses and indexes automatically. | Getting started fast. Any store with a product export. |
| Product Feed | Connect a Google Shopping feed or Shopify product feed URL. | Stores with existing feed infrastructure. Better data quality. |
| Direct API / Shopify | For Shopify stores: hit /products.json for instant clean structured product data. For others: a simple POST webhook. | Serious sellers who need live inventory accuracy. |

## **3.2 Merchandising Rules**

Where the seller controls what gets shown and when.

| Rule Type | Description |
| :---- | :---- |
| Priority Categories | Ordered list of product categories. The agent prioritises higher-ranked categories when multiple products match a query. |
| Pinned Products | Specific products the agent always includes when relevant. E.g. pin a new collection to always appear for seasonal queries. |
| Seasonal Promotions | Date-ranged rules: from Dec 1 to Jan 5, always surface winter sale products on matching queries. |
| Cross-sell Rules | If a buyer asks for X, also show Y. Written in plain English, parsed by the agent. |
| New Arrivals Boost | Toggle: always boost products added in the last 30 days when relevance is close. |

## **3.3 Guardrails**

Hard rules the agent never violates regardless of what a consumer agent asks.

| Guardrail | Description |
| :---- | :---- |
| Minimum Price Floor | Agent will never recommend a product below this price threshold, even if asked. |
| Excluded Products | Specific SKUs or entire categories the agent never surfaces. Discontinued lines, sample products, B-stock. |
| Max Discount Cap | The agent never goes beyond this percentage discount. |
| Off-Topic Block | Topics the agent deflects. Competitor mentions, unverified claims, out-of-scope queries. |

## **3.4 Intent Analytics Dashboard**

The seller's window into what agents are actually shopping for.

* Total agent interactions — day/week/month trend line

* Top queried categories — ranked bar chart

* Budget distribution — histogram showing where buyer budgets cluster

* Top converting products — products that appear in recommendations and result in a referral click

* Gap analysis — queries that returned no good match. Products the seller should be stocking. Most valuable insight in the dashboard.

* Query feed — live anonymised stream of recent agent queries in plain English

* Agent platform breakdown — which platforms are sending agents (ChatGPT, Perplexity, custom agents)

# **4\. Technology Stack**

| Layer | Technology | Why |
| :---- | :---- | :---- |
| Backend / API | Python \+ FastAPI | Fast to write, async support, great for streaming responses |
| Product Ingestion | CSV parser / httpx for feed URLs / Shopify /products.json | No crawling needed — clean structured data from the start |
| Embeddings | OpenAI text-embedding-3-small | Fast, cheap, good quality for product search |
| Vector Store | ChromaDB (in-memory) | Zero setup, no external service needed for hackathon |
| LLM | claude-sonnet-4-6 via Anthropic API | Best instruction-following for structured outputs |
| Frontend | Next.js 14 \+ Tailwind CSS | Fast to build, looks professional, easy streaming UI |
| API Communication | REST \+ Server-Sent Events (SSE) | SSE for streaming agent responses — no blank screen |

# **5\. Repository Structure**

Claude Code must create the following directory and file structure exactly:

| mime/ ├── backend/ │   ├── main.py            \# FastAPI app entry point │   ├── ingestor.py        \# Product feed / CSV ingestion logic │   ├── embedder.py        \# Embedding \+ ChromaDB indexing │   ├── agent.py           \# Store agent RAG pipeline │   ├── models.py          \# Pydantic data models │   ├── config.py          \# Environment variables \+ constants │   └── requirements.txt ├── frontend/ │   ├── app/ │   │   ├── page.tsx       \# Landing / onboarding page │   │   ├── demo/ │   │   │   └── page.tsx   \# Split-screen demo interface │   │   └── layout.tsx │   ├── components/ │   │   ├── OnboardingForm.tsx    \# Feed URL/CSV input \+ index progress │   │   ├── ConsumerAgent.tsx    \# Left panel — intent query sender │   │   ├── BrandAgent.tsx       \# Right panel — agent response display │   │   ├── ProductCard.tsx      \# Individual product recommendation card │   │   └── ProgressBar.tsx      \# Index progress indicator │   ├── lib/ │   │   └── api.ts               \# API client functions │   ├── package.json │   └── tailwind.config.ts ├── .env.example └── README.md |
| :---- |

# **6\. Data Models**

All models live in backend/models.py and are Pydantic v2 classes.

## **6.1 Product**

| class Product(BaseModel):     id: str              \# UUID generated at ingestion time     name: str            \# Product name     description: str     \# Full product description     category: str        \# e.g. 'running shoes', 'laptop'     price: float         \# Numeric price     currency: str        \# ISO 4217 e.g. 'EUR', 'USD'     url: str             \# Direct product page URL     image\_url: str | None     availability: str    \# 'in\_stock' | 'out\_of\_stock' | 'unknown'     attributes: dict\[str, str\]  \# colour, size, material, brand, etc.     raw\_text: str        \# Full text used for embedding |
| :---- |

## **6.2 StoreIndex**

| class StoreIndex(BaseModel):     store\_id: str     store\_url: str       \# Original feed URL or 'csv\_upload'     store\_name: str     store\_description: str     products: list\[Product\]     indexed\_at: datetime     product\_count: int |
| :---- |

## **6.3 IntentQuery**

| class IntentQuery(BaseModel):     session\_id: str     query\_text: str          \# Natural language query from consumer agent     category: str | None     budget\_min: float | None     budget\_max: float | None     currency: str \= 'EUR'     delivery\_country: str | None   \# ISO 3166-1 alpha-2     required\_by: str | None        \# ISO date string     style\_descriptors: list\[str\]     size: str | None     max\_results: int \= 3 |
| :---- |

## **6.4 ProductRecommendation**

| class ProductRecommendation(BaseModel):     rank: int     product: Product     relevance\_score: float   \# 0.0 – 1.0 from vector search     rationale: str           \# LLM-generated explanation     price\_in\_budget: bool |
| :---- |

## **6.5 AgentResponse**

| class AgentResponse(BaseModel):     session\_id: str     store\_id: str     store\_name: str     recommendations: list\[ProductRecommendation\]     agent\_message: str       \# Short conversion-focused summary     query\_understood: str    \# What the agent interpreted the query as     interaction\_id: str      \# UUID for this interaction     response\_time\_ms: int |
| :---- |

# **7\. Backend API Specification**

All endpoints are defined in backend/main.py. Base URL: http://localhost:8000

## **7.1 POST /api/onboard**

Triggers the full ingestion pipeline from a product feed URL or CSV upload. Returns a store\_id on completion.

Request body:

| { "url": "https://store.myshopify.com/products.json" } // OR multipart form-data with a CSV file |
| :---- |

Response (streaming via SSE):

| data: {"event": "ingest\_start", "message": "Fetching product feed...", "progress": 5} data: {"event": "ingest\_complete", "message": "Loaded 124 products", "progress": 50} data: {"event": "index\_start", "message": "Building search index...", "progress": 55} data: {"event": "index\_complete", "message": "Index ready", "progress": 100} data: {"event": "done", "store\_id": "uuid", "store\_name": "...", "product\_count": 124} data: {"event": "error", "message": "Could not parse feed — check URL or file format"} |
| :---- |

## **7.2 POST /api/query**

Sends an intent query to the store agent. Accepts an IntentQuery, returns an AgentResponse. Supports streaming via SSE if Accept: text/event-stream header is sent.

Streaming events:

| data: {"event": "searching", "message": "Searching 124 products..."} data: {"event": "found", "message": "Found 8 candidates, applying filters..."} data: {"event": "generating", "message": "Generating recommendations..."} data: {"event": "token", "token": "Based"}   \# LLM tokens streamed one by one data: {"event": "done", "response": { ...AgentResponse... }} |
| :---- |

## **7.3 GET /api/store/{store\_id}**

Returns the StoreIndex for a given store\_id.

## **7.4 GET /api/health**

Returns {"status": "ok", "indexed\_stores": N}.

# **8\. Backend Module Specifications**

## **8.1 ingestor.py**

Responsible for loading product data from a Shopify /products.json URL, a Google Shopping feed URL, or an uploaded CSV file — and returning structured Product objects. No crawling.

| async def ingest\_shopify(url: str) \-\> list\[Product\]:     \# url should end with /products.json     \# Returns all products from the JSON feed async def ingest\_csv(file\_path: str) \-\> list\[Product\]:     \# Parses a product CSV with flexible column detection     \# Detects: name, description, price, url, image, category, availability async def ingest\_feed(url: str) \-\> list\[Product\]:     \# Attempts Shopify JSON first, falls back to Google Shopping feed XML |
| :---- |

Implementation notes:

* For Shopify: GET /products.json?limit=250, paginate if needed, map fields directly to Product model

* For CSV: detect column names flexibly (title/name/product\_name, etc.), generate UUID for each product id

* If price is not found in a row, set price=0.0 and availability='unknown'

* Deduplicate products by URL after ingestion

## **8.2 embedder.py**

Embeds ingested products and stores them in ChromaDB for semantic search.

| async def index\_products(store\_id: str, products: list\[Product\]) \-\> ChromaCollection: async def search\_products(store\_id: str, query: str, n\_results: int \= 10\) \-\> list\[tuple\[Product, float\]\]:     \# Returns list of (Product, relevance\_score) tuples |
| :---- |

Implementation notes:

* Text to embed: f'{product.name}. {product.description}. Category: {product.category}. Attributes: {product.attributes}'

* Use OpenAI text-embedding-3-small

* Store full product JSON as ChromaDB metadata

* Collection name pattern: f'store\_{store\_id}'

## **8.3 agent.py**

The core store agent RAG pipeline.

| async def run\_agent(store\_id: str, query: IntentQuery) \-\> AgentResponse: |
| :---- |

Step-by-step pipeline:

1. Build a semantic search string from the IntentQuery: combine query\_text, category, style\_descriptors

2. Call search\_products() with n\_results=10 to get candidate products

3. Apply hard filters: remove products outside budget\_min/budget\_max, remove out\_of\_stock items if known

4. Take top 3 filtered candidates (or top 3 unfiltered if fewer than 3 pass filters)

5. Build a prompt for Claude containing: store context, the consumer's intent query, and the 3 candidate products as JSON

6. Call Claude claude-sonnet-4-6 to generate: (a) a concise rationale for each product, (b) a short conversion-focused agent\_message, (c) a query\_understood summary

7. Parse Claude's response and assemble the final AgentResponse

Agent system prompt (in config.py):

| AGENT\_SYSTEM\_PROMPT \= """ You are a conversion-focused product matching agent for {store\_name}. A consumer AI agent has sent you a shopping intent query on behalf of their user. Your job is to return the best-matching products from the catalogue provided. Optimise for conversion: match intent precisely, filter by constraints, surface the most relevant products clearly. Do not embellish or tell a brand story. Respond in JSON with this exact structure: {   "agent\_message": "1-2 sentences: what you found and why it matches. No fluff.",   "query\_understood": "One sentence summarising the interpreted query.",   "rationales": \["reason for product 1", "reason for product 2", "reason for product 3"\] } Be specific. Reference actual product features. Do not invent information. """ |
| :---- |

# **9\. Frontend Specification**

## **9.1 Page 1: Landing / Onboarding (app/page.tsx)**

Clean, confident, minimal. The UI should communicate infrastructure, not a toy chatbot.

Layout:

* Full-height centred layout with dark background (\#0F172A)

* Large headline: 'Your store is invisible to AI shoppers.' in white

* Subheadline: 'Connect your product feed. We'll handle the rest.' in indigo (\#6366F1)

* Two input options: a URL field (for Shopify /products.json or Google Shopping feed) and a CSV upload button

* On submit: transitions into a progress display showing index events streamed from POST /api/onboard

* Progress bar fills as SSE events arrive, with a live status message beneath it

* On completion: 'Ready. 124 products indexed.' with a 'See it in action →' button that navigates to /demo?store\_id={id}

## **9.2 Page 2: Demo Interface (app/demo/page.tsx)**

Split 50/50 horizontally. Left panel is the consumer agent. Right panel is the store agent. This is the money screen for judges.

### **Left panel — ConsumerAgent.tsx:**

* Header: 'Consumer AI Agent' with a small robot icon

* Preset intent query buttons — pre-written queries judges can click instantly

* 'Or write your own' text input below the presets

* 'Send Query' button

* Live display of the outgoing query formatted as a JSON block (the IntentQuery sent to the API)

* Status indicator: 'Searching 124 products...' while waiting

### **Right panel — BrandAgent.tsx:**

* Header: '{Store Name} Agent'

* agent\_message at the top — short, conversion-focused

* query\_understood in a subtle grey box

* 3 ProductCard components below

* Response time at the bottom: 'Response in 1.2s'

### **ProductCard.tsx:**

* Product image on the left (100x100px, object-fit: cover, rounded)

* Product name, price, and availability badge on the right

* Rationale text below in grey — why this product matches the query

* 'View Product' link that opens the product URL in a new tab

Animation: when a new query is sent, the right panel fades out and streams in the new response. The agent\_message appears word by word via SSE token stream.

# **10\. Environment Variables**

| \# .env.example ANTHROPIC\_API\_KEY=your\_key\_here OPENAI\_API\_KEY=your\_key\_here      \# For embeddings only BACKEND\_PORT=8000 FRONTEND\_PORT=3000 MAX\_PRODUCTS\_PER\_STORE=500 CHROMA\_PERSIST\_DIR=./chroma\_data  \# Optional: persist index to disk |
| :---- |

# **11\. Python Dependencies (requirements.txt)**

| fastapi\>=0.110.0 uvicorn\[standard\]\>=0.27.0 pydantic\>=2.0.0 httpx\>=0.26.0 anthropic\>=0.20.0 openai\>=1.12.0 chromadb\>=0.4.0 python-dotenv\>=1.0.0 sse-starlette\>=1.6.0 pandas\>=2.0.0       \# CSV ingestion lxml\>=5.0.0         \# Feed XML parsing |
| :---- |

# **12\. Demo Scenario & Recommended Test Stores**

## **12.1 Pre-Validated Test Stores**

| Store Type | Approach | Why it works well |
| :---- | :---- | :---- |
| Any Shopify store | Append /products.json to the URL | Returns clean JSON with all products — no crawling, no parsing. Fastest path to a working demo. |
| books.toscrape.com | Export CSV manually or generate a sample CSV | Built for scraping demos. Use the structured data, not the HTML. |
| Google Shopping feed | Point to any valid feed URL | Standard XML format — clean, reliable. |

| *Pro tip: For any Shopify store, hitting /products.json returns clean JSON for all products. This is the fastest and most reliable path for the demo — use it.* |
| :---- |

## **12.2 Demo Script (3 minutes)**

8. Open the landing page. Say: 'A store owner lands here and connects their product feed.'

9. Paste the pre-loaded Shopify /products.json URL. Click Connect. The progress bar fills live.

10. When complete: '124 products indexed in 8 seconds.' Click 'See it in action.'

11. The split-screen appears. Say: 'This is what the agent-to-agent conversation looks like.'

12. Click the first preset query: 'Running shoes under €120, ship to Amsterdam'. Say: 'A consumer AI agent sends this structured intent...'

13. The right panel streams the store agent's response. Three product cards appear. Say: '...and the store responds in under 2 seconds with the best matches.'

14. Show the JSON query block on the left. Say: 'Machine to machine. No human browsing. Structured intent, structured response.'

15. Run one more preset query to show it's consistent.

16. Close with: 'Every store on Shopify has a storefront for humans. None of them have a structured interface for agents. MIME is that interface.'

# **13\. Acceptance Criteria**

Claude Code must verify all of the following before the implementation is considered complete:

| \# | Criterion | How to verify |
| :---- | :---- | :---- |
| 1 | Backend starts with no errors on uvicorn main:app \--reload | Run and check terminal output |
| 2 | GET /api/health returns {status: ok} | curl localhost:8000/api/health |
| 3 | POST /api/onboard with a Shopify /products.json URL streams SSE events and completes with a store\_id | Test with a live Shopify store |
| 4 | At least 10 products are indexed after onboarding | Check product\_count in done event |
| 5 | POST /api/onboard with a CSV file works correctly | Upload a sample CSV |
| 6 | POST /api/query returns an AgentResponse with 1–3 recommendations | Send a test IntentQuery via curl |
| 7 | Budget filter works — querying with budget\_max=50 returns no products priced over 50 | Manual test with a low budget query |
| 8 | Frontend loads at localhost:3000 with no console errors | npm run dev and check browser |
| 9 | Onboarding form submits a URL and displays live progress from the SSE stream | Manual UI test |
| 10 | Demo page split-screen renders correctly | Manual UI test |
| 11 | Clicking a preset query sends it and response appears in right panel within 5 seconds | Manual UI test |
| 12 | Product cards display image, name, price, and rationale correctly | Manual UI test |
| 13 | 'View Product' links open the correct product URL | Click each link |
| 14 | Error states handled — invalid URL or bad CSV shows a readable error | Submit a broken URL and malformed CSV |
| 15 | Full demo can be run end-to-end in under 3 minutes | Time a complete run-through |

# **14\. Recommended Build Order**

Build in this exact sequence to ensure each layer is testable before the next is added:

17. models.py — define all Pydantic models first. Everything depends on these.

18. config.py — load .env variables, define all prompt constants.

19. ingestor.py — implement ingest\_shopify(), ingest\_csv(), ingest\_feed(). Test manually with a Shopify /products.json URL before moving on.

20. embedder.py — implement index\_products() and search\_products(). Test that semantic search returns relevant results for a plain text query.

21. agent.py — implement run\_agent(). Test end-to-end with a hardcoded IntentQuery. Verify AgentResponse is returned with real rationales.

22. main.py — wire all modules into FastAPI endpoints. Test all endpoints via curl.

23. Frontend: OnboardingForm.tsx — build the URL/CSV input and SSE progress display. Connect to POST /api/onboard.

24. Frontend: ProductCard.tsx — build the product card component with mock data first.

25. Frontend: ConsumerAgent.tsx and BrandAgent.tsx — build the split-screen panels.

26. Frontend: demo/page.tsx — wire everything together. Connect to POST /api/query.

27. End-to-end test: run the full demo script from section 12.2 and verify all 15 acceptance criteria pass.

**MIME — Built for the agentic web.**

*Hackathon Edition · February 2026 · Confidential*