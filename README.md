## Setup

```
npm run knex -- migrate:latest
npm run dev
```

## Requisitos funcionais

- ✅ Deve ser possível criar um usuário.
- ✅ Deve ser possível identificar o usuário entre as requisições.
- ✅ Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- ✅ Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
- ✅ Deve ser possível apagar uma refeição.
- ✅ Deve ser possível listar todas as refeições de um usuário.
- ✅ Deve ser possível visualizar uma única refeição.
- ✅ Deve ser possível recuperar as métricas de um usuário, incluindo:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta

## Regras de negócio

- ✅ O usuário só pode visualizar, editar e apagar as refeições que ele criou.

# Endpoints

## Users

**GET** /users - Retorna a lista de todos os usuários (usado p/ dev)

```JSON
    {
        "users": [
            {
                "id": "bb396339-6686-400f-8816-2b731f2c8121",
                "session_id": "27a8142a-dbdd-46b7-8374-2c7e8a15e444",
                "name": "John Doe",
                "email": "johndoe@example.com"
            }
        ]
    }
```

**GET** /users/summary/:id

```JSON
    {
        "userSummary": {
            "totalMeals": 6,
            "totalMealsOnDiet": 4,
            "totalMealsOutOfDiet": 2,
            "biggestDietStreak": 3
        }
    }
```

**POST** /users

```JSON
    "name": "John Doe",
    "email": "johndoe@example.com"
```

## Meals

- **GET** /meals
- **GET** /meals/:id
- **POST** /meals

```JSON
    "title": "Sopa de legumes",
    "description": "Com batatas, cenouras e beterraba.",
    "is_on_diet": true,
    "user_id": "bb396339-6686-400f-8816-2b731f2c0211"
```

- **PUT** /meals/:id

```JSON
    "title": "Novo título",
    "description": "Nova descrição da refeição",
    "is_on_diet": false
```

- **DELETE** /meals/:id
