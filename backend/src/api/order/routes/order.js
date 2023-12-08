{
  "routes"; [
    {
      "method": "GET",
      "path": "/api/orders",
      "handler": "order.find"
    },
    {
      "method": "POST",
      "path": "/api/orders",
      "handler": "order.create"
    },
    // ... other routes ...
  ]
}
