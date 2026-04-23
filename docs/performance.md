# Performance Optimization Guide

This document outlines performance optimizations implemented in the application and recommendations for further improvements.

---

## Table of Contents

- [Frontend Optimizations (Angular 20)](#frontend-optimizations-angular-20)
- [Backend Optimizations (NestJS)](#backend-optimizations-nestjs)
- [Database Optimizations (PostgreSQL)](#database-optimizations-postgresql)
- [Network & Asset Optimizations](#network--asset-optimizations)
- [Monitoring & Metrics](#monitoring--metrics)
- [Performance Budgets](#performance-budgets)

---

## Frontend Optimizations (Angular 20)

### 1. Signals for Reactive State

Angular 20 uses Signals instead of Zone.js for precise change detection:

```typescript
// Before (Zone.js) – triggers change detection on every async event
products: Product[] = [];

// After (Signals) – only updates when value actually changes
products = signal<Product[]>([]);
```


### Benefits
The application leverages **Angular Signals** for state management, providing:
*   **Up to 30% faster rendering** due to fine-grained reactivity.
*   **Smaller bundle size** (enabling zoneless applications without Zone.js overhead).
*   **Predictable reactive flow** and better developer experience.

### 2. Incremental Hydration & Deferrable Views
We use the new `@defer` syntax to optimize initial load time by loading heavy components only when needed.

```html
@defer (on viewport) {
  <product-reviews [productId]="productId" />
} @placeholder {
  <div class="skeleton">Loading reviews...</div>
}

@defer (on interaction) {
  <heavy-chart />
} @placeholder {
  <button>Load chart</button>
}
```

> **Note:** Deferrable views significantly improve **Core Web Vitals** (especially LCP and TBT) by delaying the loading of non-critical components until they enter the viewport or the user interacts with them.

### 3. Lazy Loading
To keep the initial bundle size minimal, routes are loaded lazily. This ensures that users only download the code for the features they actually visit.

```typescript
// app.routes.ts
export const routes: Routes = [
  { 
    path: 'checkout', 
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent) 
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.routes') 
  }
];
```

> **Note:** Combined with **Standalone Components**, this approach allows for high-performance navigation and better resource management.

### 4. OnPush Change Detection
To optimize performance, components use the `OnPush` strategy, which reduces the number of change detection checks by only reacting to `@Input` changes or manual triggers.

```typescript
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product; // immutable data flow
}
```

### 5. New Control Flow Syntax
The project utilizes the modern Angular Control Flow, which is more performant than legacy directives like `*ngIf` and `*ngFor`.

```html
@if (isLoggedIn) {
  <user-greeting [name]="user().name" />
}

@for (product of products(); track product.id) {
  <product-card [product]="product" />
}
```

### 6. Production Build Optimizations
To ensure maximum speed, the production build includes:

```bash
# Build with all optimizations
npm run build -- --optimization

# Analyze bundle size
npm run build -- --stats-json
npx source-map-explorer dist/*.js
```

**Key features enabled by default:**
*   **AOT (Ahead-of-Time) Compilation**: Pre-compiles HTML and TypeScript into efficient JavaScript.
*   **Tree Shaking**: Removes unused code from the final bundle.
*   **Minification**: Uses Terser to compress the JavaScript code.
*   **Budget Thresholds**: Configured to warn at 1MB and fail the build at 2MB to prevent bundle bloat.

---

## Backend Optimizations (NestJS)

### 1. Database Connection Pooling
To handle high concurrent traffic and reuse database connections efficiently, we use connection pooling:

```typescript
// app.module.ts
SequelizeModule.forRootAsync({
  useFactory: () => ({
    dialect: 'postgres',
    pool: {
      max: 20,        // maximum number of connections in pool
      min: 2,         // minimum number of connections in pool
      acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000     // maximum time, in milliseconds, that a connection can be idle before being released
    }
  })
})
```

### 2. Caching with Redis
Frequent read operations (like product lists) are cached to reduce database load and improve response times:

```bash
npm install @nestjs/cache-manager cache-manager cache-manager-redis-yet
```

```typescript
// products.module.ts
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // cache for 5 minutes
      max: 100, // maximum number of items in cache
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
})
export class ProductsModule {
  @Get()
  @UseInterceptors(CacheInterceptor) // automatically cache the response
  findAll() { /* ... */ }
}
```

### 3. Response Compression
Gzip compression is enabled to reduce the size of the response body, significantly decreasing the time it takes to download data:

```typescript
// main.ts
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  await app.listen(process.env.PORT || 3000);
}
```

> **Note:** Response compression is particularly effective for large JSON responses and can reduce payload size by up to 70-80%.

### 4. Rate Limiting
To protect the API from brute-force attacks and excessive traffic, we implement rate limiting:

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60,      // time window in seconds
      limit: 10,    // maximum requests per IP within the TTL
    }]),
  ],
})
export class AppModule {}
```

### 5. Pagination for List Endpoints
To avoid loading massive datasets into memory and ensure fast response times, all list endpoints support pagination:

```typescript
async findAll(page = 1, limit = 10): Promise<PaginatedResult> {
  const offset = (page - 1) * limit;
  const { rows, count } = await this.productModel.findAndCountAll({
    limit,
    offset,
    attributes: { exclude: ['internalNote'] }, // select only required fields
    where: { isActive: true }
  });
  return { items: rows, total: count, page, limit };
}
```

### 6. Database Performance & Indexing
We optimize database queries by using selective field loading and ensuring proper indexing in the database schema:

```typescript
// Efficient querying with Sequelize
await this.orderModel.findAll({
  where: { userId, status: 'pending' },
  order: [['createdAt', 'DESC']],
  // Ensure 'userId' and 'status' columns are indexed in PostgreSQL for maximum speed
});
```

> **Note:** Proper indexing significantly reduces query execution time for large datasets, especially when filtering by foreign keys or status fields.

## Database Optimizations (PostgreSQL)

### 1. Indexing Strategy
Execute these migrations after the initial setup to ensure high-speed data retrieval for common filters and relations:

```sql
-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Composite index for common filters
CREATE INDEX idx_products_category_price ON products(category_id, price) WHERE is_active = true;

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Users
CREATE INDEX idx_users_email ON users(email);
```

### 2. Query Optimization – Avoid N+1
The application uses Eager Loading to prevent the common N+1 query performance bottleneck.

```typescript
// BAD (N+1 queries - executes a separate query for each order)
const orders = await Order.findAll();
for (const order of orders) {
  const items = await OrderItem.findAll({ where: { orderId: order.id } });
}

// GOOD (Single query with JOIN - much more efficient)
const orders = await Order.findAll({
  include: [OrderItem], // eager loading
  attributes: ['id', 'total', 'status']
});
```

### 3. VACUUM and ANALYZE
For long-running production databases, regular maintenance ensures optimal query planning:

```sql
-- Update table statistics for the query planner
ANALYZE VERBOSE products;

-- Clean up dead rows and update statistics
VACUUM ANALYZE orders;
```

### 4. PostgreSQL Configuration Tuning
Recommended `postgresql.conf` settings for production (optimized for moderate RAM environments like Railway):

```ini
# Memory
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 50-75% of RAM
work_mem = 8MB                   # per-sort/join memory

# Write performance
wal_buffers = 16MB
checkpoint_completion_target = 0.9

# Query planning
default_statistics_target = 100

# Connections
max_connections = 100
```

> **Note:** These settings should be adjusted based on the specific resources allocated to your Railway database instance.

---

## Network & Asset Optimizations

### 1. Image Optimization
Use modern image formats and native browser features to ensure fast loading and smooth rendering:

```html
<!-- Use modern formats with fallback -->
<picture>
  <source type="image/webp" [srcset]="product.imageUrlWebp">
  <img [src]="product.imageUrl" loading="lazy" decoding="async" alt="Product Image">
</picture>
```

### 2. HTTP/2 and Keep-Alive
High-performance protocols are used to minimize connection overhead. 
> **Note:** When deploying on **Railway** and **Vercel**, HTTP/2 and Keep-Alive are enabled by default for all incoming traffic.

### 3. CDN for Static Assets
Vercel automatically distributes your frontend assets (JS, CSS, images) across its global **Edge Network**. This ensures low latency by serving files from the server closest to the user.

### 4. Prefetching and Preloading
Critical resources are prioritized in `index.html` to speed up the initial handshake and rendering:

```html
<!-- Preconnect to the API to speed up the first request -->
<link rel="preconnect" href="https://api.your-backend.com">

<!-- Preload critical CSS -->
<link rel="preload" as="style" href="/styles.css">
```

### 5. Service Worker & PWA
For offline capabilities and instant subsequent loads, the application can be converted into a Progressive Web App:

```bash
# Add Angular PWA support
ng add @angular/pwa
```

> **Note:** This adds a Service Worker that caches the application shell and static assets, significantly reducing load times on slow networks.

---

## Monitoring & Metrics

### 1. Prometheus Integration (Backend)
To track server health and performance in real-time, we use Prometheus to collect default Node.js and NestJS metrics.

```bash
npm install @willsoto/nestjs-prometheus
```

```typescript
// app.module.ts
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: '/metrics', // Exposes metrics for Prometheus scraper
    }),
  ],
})
export class AppModule {}
```
> **Metrics endpoint:** `https://railway.app`

### 2. Lighthouse Performance Targets
The project aims for high scores in Google Lighthouse by meeting the following Core Web Vitals targets:



| Metric | Target |
| :--- | :--- |
| **First Contentful Paint (FCP)** | < 1.5s |
| **Largest Contentful Paint (LCP)** | < 2.5s |
| **Time to Interactive (TTI)** | < 3.0s |
| **Total Blocking Time (TBT)** | < 200ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 |

### 3. Performance Budgets
To prevent bundle size bloat over time, we enforce performance budgets in `angular.json`:

```json
"budgets": [
  {
    "type": "bundle",
    "name": "initial",
    "maximumWarning": "500kb",
    "maximumError": "1mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "10kb",
    "maximumError": "20kb"
  }
]
```

> **Note:** If a build exceeds the **maximumError** threshold, the CI/CD pipeline will fail, ensuring that no unoptimized code reaches production.

---

## Optimization Checklist

- [ ] **Build**: Angular production build enabled (`--optimization`).
- [ ] **Routing**: Lazy loading implemented for all feature modules.
- [ ] **Reactivity**: `OnPush` change detection applied to presentational components.
- [ ] **State**: Angular Signals used instead of Zone.js for application state where possible.
- [ ] **Assets**: Images are lazy-loaded and converted to **WebP** format.
- [ ] **Payload**: Response compression (Gzip/Brotli) enabled on the backend.
- [ ] **Database**: Indexes created for all foreign keys and frequently filtered fields.
- [ ] **Performance**: Pagination implemented for all large collections.
- [ ] **Security**: Rate limiting added to all public API endpoints.
- [ ] **Caching**: Redis/Cache-manager configured for static data (categories, product details).
- [ ] **Monitoring**: Prometheus metrics exposed for real-time health tracking.
- [ ] **Vitals**: Lighthouse score **> 90** for both mobile and desktop views.
