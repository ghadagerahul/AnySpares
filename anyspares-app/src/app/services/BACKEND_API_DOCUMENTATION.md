# Order Service Backend API Documentation

This document provides the backend API endpoints and request/response formats needed to support the frontend order and bucket management functionality.

## Base URL
```
{API_BASE_URL}/api
```

## Endpoints

### User Management APIs

#### 1. Save User Address
**Endpoint:** `POST /api/user/addresses`

**Description:** Saves a new address for the user.

**Request Body:**
```json
{
  "userId": "user-123",
  "name": "John Doe",
  "phone": "9876543210",
  "street": "123 Main Street, Sector 15",
  "city": "Gurgaon",
  "state": "Haryana",
  "pincode": "122001",
  "isDefault": false
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Address saved successfully",
  "data": {
    "id": "addr_123456",
    "userId": "user-123",
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main Street, Sector 15",
    "city": "Gurgaon",
    "state": "Haryana",
    "pincode": "122001",
    "isDefault": false,
    "createdAt": "2026-04-14T10:00:00.000Z"
  }
}
```

#### 2. Get User Addresses
**Endpoint:** `GET /api/user/addresses/{userId}`

**Description:** Retrieves all saved addresses for a user.

**Parameters:**
- `userId` (path parameter): The ID of the user

**Response (Success):**
```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": "addr_123456",
      "userId": "user-123",
      "name": "John Doe",
      "phone": "9876543210",
      "street": "123 Main Street, Sector 15",
      "city": "Gurgaon",
      "state": "Haryana",
      "pincode": "122001",
      "isDefault": true,
      "createdAt": "2026-04-14T10:00:00.000Z"
    },
    {
      "id": "addr_789012",
      "userId": "user-123",
      "name": "Jane Smith",
      "phone": "9123456789",
      "street": "456 Park Avenue, MG Road",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "isDefault": false,
      "createdAt": "2026-04-14T11:00:00.000Z"
    }
  ]
}
```

#### 3. Update User Address
**Endpoint:** `PUT /api/user/addresses/{addressId}`

**Description:** Updates an existing address.

**Parameters:**
- `addressId` (path parameter): The ID of the address to update

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "street": "456 New Street, Sector 20",
  "city": "Gurgaon",
  "state": "Haryana",
  "pincode": "122001",
  "isDefault": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "id": "addr_123456",
    "userId": "user-123",
    "name": "John Doe Updated",
    "phone": "9876543210",
    "street": "456 New Street, Sector 20",
    "city": "Gurgaon",
    "state": "Haryana",
    "pincode": "122001",
    "isDefault": true,
    "updatedAt": "2026-04-14T12:00:00.000Z"
  }
}
```

#### 4. Delete User Address
**Endpoint:** `DELETE /api/user/addresses/{addressId}`

**Description:** Deletes a user address.

**Parameters:**
- `addressId` (path parameter): The ID of the address to delete

**Response (Success):**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

#### 5. Save User Contact Details
**Endpoint:** `POST /api/user/contact`

**Description:** Saves or updates user contact details.

**Request Body:**
```json
{
  "userId": "user-123",
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john.doe@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact details saved successfully",
  "data": {
    "userId": "user-123",
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john.doe@example.com",
    "updatedAt": "2026-04-14T10:00:00.000Z"
  }
}
```

#### 6. Get User Contact Details
**Endpoint:** `GET /api/user/contact/{userId}`

**Description:** Retrieves user contact details.

**Parameters:**
- `userId` (path parameter): The ID of the user

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact details retrieved successfully",
  "data": {
    "userId": "user-123",
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john.doe@example.com",
    "createdAt": "2026-04-14T10:00:00.000Z",
    "updatedAt": "2026-04-14T10:00:00.000Z"
  }
}
```

### Order Management APIs

#### 7. Place Order
**Endpoint:** `POST /api/orders/place-order`

**Description:** Creates a new order from the bucket items.

**Request Body:**
```json
{
  "userId": "user-123",
  "items": [
    {
      "productId": "prod-123",
      "productName": "Carburetor Repair Kit",
      "price": 449,
      "quantity": 2,
      "imageUrl": "assets/two-wheelers/product-services/carburetor-kit.jpg"
    }
  ],
  "address": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main Street, Sector 15",
    "city": "Gurgaon",
    "state": "Haryana",
    "pincode": "122001"
  },
  "contact": {
    "name": "John Doe",
    "phone": "9876543210",
    "email": "john.doe@example.com"
  },
  "paymentMethod": "cod",
  "totalAmount": 898
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD-2026-001",
    "userId": "user-123",
    "totalAmount": 898,
    "status": "Pending",
    "itemCount": 2,
    "orderDate": "2026-04-14T11:30:00.000Z",
    "estimatedDelivery": "2026-04-18T00:00:00.000Z"
  }
}
```

#### 8. Get User Orders
**Endpoint:** `GET /api/orders/user/{userId}`

**Description:** Retrieves all orders for a specific user.

**Parameters:**
- `userId` (path parameter): The ID of the user

**Response (Success):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "orderId": "ORD-2026-001",
      "userId": "user-123",
      "totalAmount": 898,
      "status": "Delivered",
      "itemCount": 2,
      "orderDate": "2026-04-10T10:00:00.000Z",
      "items": [
        {
          "productId": "prod-123",
          "productName": "Carburetor Repair Kit",
          "price": 449,
          "quantity": 2
        }
      ]
    }
  ]
}
```

#### 9. Get Order By ID
**Endpoint:** `GET /api/orders/{orderId}`

**Description:** Retrieves details of a specific order.

**Parameters:**
- `orderId` (path parameter): The ID of the order

**Response (Success):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "orderId": "ORD-2026-001",
    "userId": "user-123",
    "totalAmount": 898,
    "status": "Delivered",
    "itemCount": 2,
    "orderDate": "2026-04-10T10:00:00.000Z",
    "estimatedDelivery": "2026-04-18T00:00:00.000Z",
    "actualDelivery": "2026-04-16T15:30:00.000Z",
    "address": {
      "name": "John Doe",
      "phone": "9876543210",
      "street": "123 Main Street, Sector 15",
      "city": "Gurgaon",
      "state": "Haryana",
      "pincode": "122001"
    },
    "contact": {
      "name": "John Doe",
      "phone": "9876543210",
      "email": "john.doe@example.com"
    },
    "items": [
      {
        "productId": "prod-123",
        "productName": "Carburetor Repair Kit",
        "price": 449,
        "quantity": 2,
        "imageUrl": "assets/two-wheelers/product-services/carburetor-kit.jpg"
      }
    ]
  }
}
```

## Endpoints

### 1. Place Order
**Endpoint:** `POST /orders/place-order`

**Description:** Creates a new order from the bucket items.

**Request Body:**
```json
{
  "items": [
    {
      "id": "item-1",
      "productId": "prod-123",
      "productName": "Carburetor Repair Kit",
      "price": 449,
      "quantity": 2,
      "imageUrl": "assets/two-wheelers/product-services/carburetor-kit.jpg",
      "description": "High quality repair kit"
    }
  ],
  "totalPrice": 898,
  "buyerId": "user-123",
  "orderDate": "2026-03-26T11:30:00.000Z",
  "status": "Pending"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD-2026-001",
    "buyerId": "user-123",
    "totalPrice": 898,
    "status": "Pending",
    "itemCount": 2,
    "orderDate": "2026-03-26T11:30:00.000Z",
    "estimatedDelivery": "2026-03-30T00:00:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Failed to place order - Insufficient inventory"
}
```

---

### 2. Get User Orders
**Endpoint:** `GET /orders/user-orders/{buyerId}`

**Description:** Retrieves all orders for a specific buyer.

**Parameters:**
- `buyerId` (path parameter): The ID of the buyer

**Response (Success):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "orderId": "ORD-2026-001",
      "buyerId": "user-123",
      "totalPrice": 898,
      "status": "Delivered",
      "itemCount": 2,
      "orderDate": "2026-03-20T10:00:00.000Z",
      "items": [
        {
          "productId": "prod-123",
          "productName": "Carburetor Repair Kit",
          "price": 449,
          "quantity": 2
        }
      ]
    },
    {
      "orderId": "ORD-2026-002",
      "buyerId": "user-123",
      "totalPrice": 299,
      "status": "In Transit",
      "itemCount": 1,
      "orderDate": "2026-03-18T14:30:00.000Z",
      "items": [
        {
          "productId": "prod-456",
          "productName": "Brake Pads",
          "price": 299,
          "quantity": 1
        }
      ]
    }
  ]
}
```

---

### 3. Get Order By ID
**Endpoint:** `GET /orders/{orderId}`

**Description:** Retrieves details of a specific order.

**Parameters:**
- `orderId` (path parameter): The ID of the order

**Response (Success):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "orderId": "ORD-2026-001",
    "buyerId": "user-123",
    "totalPrice": 898,
    "status": "Delivered",
    "itemCount": 2,
    "orderDate": "2026-03-20T10:00:00.000Z",
    "estimatedDelivery": "2026-03-30T00:00:00.000Z",
    "actualDelivery": "2026-03-28T15:30:00.000Z",
    "shippingAddress": {
      "street": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "zipCode": "62701"
    },
    "items": [
      {
        "productId": "prod-123",
        "productName": "Carburetor Repair Kit",
        "price": 449,
        "quantity": 2,
        "imageUrl": "assets/two-wheelers/product-services/carburetor-kit.jpg"
      }
    ]
  }
}
```

---

## Implementation Notes

### Storage
- Orders should be stored in a database with the following tables/collections:
  - `Order` - Main order record
  - `OrderItem` - Individual items in each order

### Status Workflow
Order status progression should follow:
1. **Pending** - Order just created, payment pending
2. **Confirmed** - Payment received, order confirmed
3. **Packed** - Items packed and ready to ship
4. **In Transit** - Order shipped
5. **Delivered** - Order delivered
6. **Canceled** - Order canceled

### Validation
- Validate that all products exist and are in stock before placing order
- Validate buyerId exists in the system
- Check for duplicate orders (within short time window)

### Error Handling
Return appropriate HTTP status codes:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Order/Buyer not found
- `500 Internal Server Error` - Server errors

### Database Schema Example (SQL)

```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  buyer_id VARCHAR(50) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  order_date TIMESTAMP NOT NULL,
  estimated_delivery TIMESTAMP,
  actual_delivery TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## Frontend Integration

The frontend service has been created with the following capabilities:
- **Bucket Management**: Add, remove, update quantities of items
- **LocalStorage Persistence**: Bucket persists across browser sessions
- **Order Placement**: Sends order request to `/orders/place-order`
- **Order Retrieval**: Fetches user orders and specific order details
- **Real-time Updates**: Uses RxJS Subjects for reactive state management

## Security Considerations
- Always validate buyerId on the backend
- Ensure proper authentication/authorization on all endpoints
- Use HTTPS for all API calls
- Implement rate limiting to prevent abuse
- Validate all input data on the backend
