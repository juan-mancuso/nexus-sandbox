# SDK {{clientName}}

A TypeScript SDK for payment services integration, providing a simple and type-safe interface for authentication, checkout creation, and transaction management.

## 🚀 Features

- ✅ **Native TypeScript** - Full typing and IntelliSense support
- 🔐 **Secure Authentication** - JWT token system
- 💳 **Checkout Management** - Payment creation and querying
- 📊 **Transactions** - Transaction querying and management
- 🛠️ **Built-in Utilities** - Logging, validation, and error handling
- 🌐 **Multiple Environments** - Development, stage, and production
- 📝 **Complete Documentation** - Examples and usage guides

## 🏁 Quick Start

### Initial Setup

```typescript
import { setAppConfig, ClientSDK, authenticate } from 'boilerplate-sdk';

// Configure the SDK
setAppConfig({
  env: 'development', // 'production' | 'stage' | 'development' | 'test'
  debug: true,
  userAgent: 'My Application v1.0.0'
});

// Authenticate and create client
const token = await authenticate('your-api-key', 'your-api-secret');
const client = new ClientSDK(token);
```

### Create a Checkout

```typescript
const checkout = await client.Checkout.createCheckout({
  amount: 1000, // Amount in cents
  currency: 'USD',
  purchase_description: 'Product purchase',
  redirection_url: {
    success: 'https://your-site.com/success',
    error: 'https://your-site.com/error',
    default: 'https://your-site.com/default'
  },
  metadata: {
    me_reference_id: 'order-123',
    customer_info: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    }
  }
});

console.log('Checkout created:', checkout.payment_request_url);
```

### Query Transactions

```typescript
// Get all transactions
const transactions = await client.Transaction.getTransactions();

// Get a specific transaction
const transaction = await client.Transaction.getTransaction('receipt-no-123');
```

## 📚 API Documentation

### Configuration

#### `setAppConfig(config)`

Configures the SDK with global parameters.

**Parameters:**

| Parameter   | Type      | Description                                    | Required |
|-------------|-----------|------------------------------------------------|----------|
| `env`       | `string`  | Environment: `production`, `stage`, `development`, `test` | ✅ |
| `debug`     | `boolean` | Enable debug logging                          | ❌ |
| `userAgent` | `string`  | Custom user agent                             | ❌ |

### Authentication

#### `authenticate(apiKey, apiSecret)`

Authenticates with the service and returns a token.

**Parameters:**

| Parameter   | Type     | Description           | Required |
|-------------|----------|-----------------------|----------|
| `apiKey`    | `string` | Merchant API key      | ✅ |
| `apiSecret` | `string` | Merchant API secret   | ✅ |

**Response:** `Promise<string>` - Authentication token

### SDK Client

#### `new ClientSDK(token)`

Creates an instance of the SDK client.

**Parameters:**

| Parameter | Type     | Description               | Required |
|-----------|----------|---------------------------|----------|
| `token`   | `string` | Authentication token      | ✅ |

### Checkout Service

#### `client.Checkout.createCheckout(request)`

Creates a new checkout for payment processing.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `amount` | `number` | Amount in cents |
| `currency` | `string` | Currency code (USD, EUR, etc.) |
| `purchase_description` | `string` | Purchase description |
| `redirection_url` | `object` | Redirection URLs |
| `redirection_url.success` | `string` | Success URL |
| `redirection_url.error` | `string` | Error URL |
| `redirection_url.default` | `string` | Default URL |
| `metadata` | `object` | Additional metadata |
| `metadata.me_reference_id` | `string` | Merchant reference ID |
| `metadata.customer_info` | `object` | Customer information |

**Response:** `Promise<CreateCheckoutResponse>`

```typescript
interface CreateCheckoutResponse {
  payment_request_id: string;
  payment_request_url: string;
  object_type: string;
  status: Status;
  last_status_message: string;
  created_at: string;
  modified_at: string;
  expired_at: string;
}
```

#### `client.Checkout.getCheckout(paymentRequestId)`

Gets information about an existing checkout.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `paymentRequestId` | `string` | Payment request ID |

### Transaction Service

#### `client.Transaction.getTransactions()`

Gets all merchant transactions.

**Response:** `Promise<GetTransactionsResponse>`

#### `client.Transaction.getTransaction(receiptNo)`

Gets a specific transaction by receipt number.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `receiptNo` | `string` | Transaction receipt number |

### Checkout Statuses

Checkouts can have the following statuses:

| Status | Description |
|--------|-------------|
| `CHECKOUT_CREATED` | Checkout created successfully |
| `CHECKOUT_PENDING` | Checkout pending payment |
| `CHECKOUT_COMPLETED` | Checkout completed successfully |
| `CHECKOUT_EXPIRED` | Checkout expired |
| `CHECKOUT_CANCELED` | Checkout canceled |

## 🛠️ Development

### Prerequisites

- Node.js >= 22.0.0
- Yarn (recommended)

## 📁 Project Structure

```
boilerplate-sdk/
├── src/
│   ├── config/              # Global configuration
│   ├── interfaces/          # TypeScript type definitions
│   ├── services/            # Core services
│   │   ├── auth.service.ts       # Authentication
│   │   ├── checkout.service.ts   # Checkout management
│   │   └── transaction.service.ts # Transaction management
│   ├── utils/               # Utilities
│   │   ├── error.ts              # Error handling
│   │   ├── httpService.ts        # HTTP client
│   │   ├── logger.ts             # Logging system
│   │   └── validation.ts         # Validations
│   └── index.ts             # Main entry point
├── __tests__/               # Tests
├── dist/                    # Compiled files
└── package.json
```


## 📖 Usage Examples

### Complete Integration Example

```typescript
import { setAppConfig, ClientSDK, authenticate } from 'boilerplate-sdk';

async function main() {
  try {
    // Configure SDK
    setAppConfig({
      env: 'development',
      debug: true,
      userAgent: 'My E-commerce v1.0.0'
    });

    // Authentication
    const token = await authenticate(
      process.env.API_KEY!,
      process.env.API_SECRET!
    );

    // Create client
    const client = new ClientSDK(token);

    // Create checkout
    const checkout = await client.Checkout.createCheckout({
      amount: 2500, // $25.00
      currency: 'USD',
      purchase_description: 'Premium product purchase',
      redirection_url: {
        success: 'https://my-store.com/success',
        error: 'https://my-store.com/error',
        default: 'https://my-store.com/default'
      },
      metadata: {
        me_reference_id: `order-${Date.now()}`,
        customer_info: {
          name: 'Maria Gonzalez',
          email: 'maria@example.com',
          phone: '+1234567890'
        }
      }
    });

    console.log('Checkout created successfully:');
    console.log('ID:', checkout.payment_request_id);
    console.log('URL:', checkout.payment_request_url);
    console.log('Status:', checkout.status);

    // Query checkout later
    const checkoutInfo = await client.Checkout.getCheckout(
      checkout.payment_request_id
    );
    console.log('Current status:', checkoutInfo.status);

    // Get transactions
    const transactions = await client.Transaction.getTransactions();
    console.log('Transactions found:', transactions.items.length);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Error Handling

```typescript
import { ClientSDK } from 'boilerplate-sdk';

const client = new ClientSDK(token);

try {
  const checkout = await client.Checkout.createCheckout(checkoutData);
  // Process successful checkout
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired or invalid
    console.error('Authentication error');
  } else if (error.response?.status === 400) {
    // Invalid input data
    console.error('Invalid data:', error.response.data);
  } else {
    // Other error
    console.error('Unexpected error:', error.message);
  }
}
```

## 🔧 Environment Configuration

### Environment Variables

```bash
# .env
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here
NODE_ENV=development
```

### Configuration by Environment

```typescript
// Development
setAppConfig({
  env: 'development',
  debug: true,
  userAgent: 'My App Dev v1.0.0'
});

// Production
setAppConfig({
  env: 'production',
  debug: false,
  userAgent: 'My App v1.0.0'
});
```
