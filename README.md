# express-js-sqlite3-template

Boilerplate for a Todo API service using Express, JavaScript and SQLite3

## Getting started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev` to spin the development server

## API Endpoints

### `GET /todos`

Fetch all the todo items from the database.

```bash
curl http://localhost:3000/todos
```

- On success, it returns a list of todo items.

  - Example response:

    ```json
    {
    "todos": [
        {
        "id": 1,
        "title": "Buy groceries",
        "completed": 0,
        "userId": 1,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 2,
        "title": "Walk the dog",
        "completed": 0,
        "userId": 1,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 3,
        "title": "Do laundry",
        "completed": 0,
        "userId": 2,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 4,
        "title": "Wash the car",
        "completed": 0,
        "userId": 2,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 5,
        "title": "Water the plants",
        "completed": 0,
        "userId": 3,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 6,
        "title": "Mow the lawn",
        "completed": 0,
        "userId": 3,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 7,
        "title": "Take out the trash",
        "completed": 0,
        "userId": 4,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 8,
        "title": "Vacuum the house",
        "completed": 0,
        "userId": 4,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 9,
        "title": "Pick up Johnny from school",
        "completed": 0,
        "userId": 5,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        },
        {
        "id": 10,
        "title": "Drop off dry cleaning",
        "completed": 0,
        "userId": 5,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
        }
    ]
    }
    ```

  - Status code: `200`
  
### `GET /todos/:id`

Fetch a single todo item by its ID.

```bash
curl http://localhost:3000/todos/7
```

- On success, it returns a single todo item.

  - Example response:

    ```json
    {
      "todo": {
        "id": 7,
        "title": "Take out the trash",
        "completed": 0,
        "userId": 4,
        "createdAt": "2024-07-31 17:19:05",
        "updatedAt": "2024-07-31 17:19:05"
      }
    }
    ```

  - Status code: `200`

- On failture, it returns an error message.

  - Example response:

    ```json
    {
      "message": "Todo item not found"
    }

    ```

  - Status code: `404`

### `POST /todos`

Create a new todo item.

```bash
curl -X POST http://localhost:3000/todos                                      \
      -H 'Content-Type: application/json'                                     \
      -d '{"title": "finish unittesting 1", "userId": 11, "completed": false}'
```

- On success, it returns the newly created todo item.

  - Example response:

    ```json
    {
      "todo": {
        "id": 11,
        "title": "finish unittesting 1",
        "completed": false,
        "userId": 10
      }
    }
    ```

  - Status code: `201`

- On failture, it returns an error message.

  - Example response:

    ```json
    {
      "message": "Todo item already exists"
    }
    ```

  - Status code: `400`

### `PUT /todos/:id`

Update a todo item by its ID.

```bash
curl -X PUT http://localhost:3000/todos/9                                      \
      -H 'Content-Type: application/json'                                     \
      -d '{"title": "finish unittesting 2", "userId": 10, "completed": true}'
```

- On success, it returns the updated todo item.

  - Example response:

    ```json
    {
      "todo": {
        "id": "9",
        "title": "finish unittesting 2",
        "completed": true,
        "userId": 10
      }
    }
    ```

  - Status code: `200`

- On failture, it returns an error message.
  
  - Example response:
  
      ```json
      {
        "message": "Todo item not found"
      }
      ```
  
  - Status code: `404`  

### DELETE /todos/:id

Delete a todo item by its ID.

```bash
curl -X DELETE http://localhost:3000/todos/9
```

- On success, it returns a success message.

  - Example response:

    ```json
    {
      "message": "Todo item deleted successfully"
    }
    ```

  - Status code: `200`
  
- On failture, it returns an error message.

  - Example response:

    ```json
    {
      "message": "Todo item not found"
    }

    ```

  - Status code: `404`
