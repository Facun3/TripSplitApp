# App de Gastos de Viaje 🧳💰

Aplicación backend REST API para gestionar **gastos compartidos durante un viaje con amigos**. Todos los participantes pueden cargar, editar y eliminar gastos, y la app calcula automáticamente los balances y las deudas finales de forma simplificada.

## 📌 Descripción

Esta aplicación permite a un grupo de viajeros:
- Registrar gastos compartidos durante un viaje
- Dividir gastos de forma igualitaria o personalizada
- Calcular automáticamente cuánto debe o le deben a cada participante
- Simplificar deudas con la menor cantidad de transferencias posibles

El proyecto está diseñado para demostrar:
- ✅ Buen modelado de dominio
- ✅ Separación de responsabilidades
- ✅ Claridad en reglas de negocio
- ✅ Diseño de API REST coherente
- ✅ Arquitectura escalable con NestJS

## 🚀 Características

- **Gestión de Viajes**: Crear y gestionar viajes con múltiples participantes
- **Participantes**: Agregar participantes a un viaje con validación de nombres únicos
- **Gastos**: CRUD completo de gastos con división personalizada
- **Balances Automáticos**: Cálculo en tiempo real de balances por participante
- **Simplificación de Deudas**: Algoritmo greedy que minimiza transferencias
- **API REST**: Endpoints bien documentados con Swagger
- **Validaciones**: Validación completa de datos con class-validator
- **Base de Datos**: SQLite para desarrollo (fácil migración a PostgreSQL)

## 🛠️ Tecnologías

- **Framework**: [NestJS](https://nestjs.com/) 11.x
- **Lenguaje**: TypeScript
- **ORM**: TypeORM 0.3.x
- **Base de Datos**: SQLite (desarrollo)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x (o pnpm/yarn)
- Git

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd app-gastos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar instalación

```bash
npm run build
```

Si la compilación es exitosa, todo está listo.

## 🚀 Iniciar la Aplicación

### Modo Desarrollo (con hot-reload)

```bash
npm run start:dev
```

El servidor se iniciará en `http://localhost:3000`

## 📚 Documentación de la API

Una vez que el servidor esté corriendo, accede a la documentación interactiva de Swagger:

```
http://localhost:3000/api
```

Desde Swagger puedes:
- Ver todos los endpoints disponibles
- Probar cada endpoint directamente
- Ver los DTOs de request/response
- Ver ejemplos de respuestas

## 🌐 Endpoints Disponibles

### Viajes

- `POST /trips` - Crear un nuevo viaje
- `GET /trips/:id` - Obtener información de un viaje

### Participantes

- `POST /trips/:tripId/participants` - Agregar participante a un viaje
- `GET /trips/:tripId/participants` - Listar todos los participantes de un viaje

### Gastos

- `POST /trips/:tripId/expenses` - Crear un nuevo gasto
- `GET /trips/:tripId/expenses` - Listar todos los gastos de un viaje
- `GET /trips/:tripId/expenses/:expenseId` - Obtener un gasto específico
- `PUT /trips/:tripId/expenses/:expenseId` - Actualizar un gasto
- `DELETE /trips/:tripId/expenses/:expenseId` - Eliminar un gasto

### Balances

- `GET /trips/:tripId/balances` - Calcular balances de todos los participantes
- `GET /trips/:tripId/settlements` - Obtener transferencias simplificadas

## 📖 Ejemplos de Uso

### 1. Crear un viaje

```bash
curl -X POST http://localhost:3000/trips \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viaje a París",
    "currency": "EUR"
  }'
```

**Respuesta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Viaje a París",
  "currency": "EUR",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### 2. Agregar participantes

```bash
curl -X POST http://localhost:3000/trips/{tripId}/participants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez"
  }'
```

### 3. Crear un gasto

```bash
curl -X POST http://localhost:3000/trips/{tripId}/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Cena en restaurante",
    "amount": 50000,
    "date": "2024-01-15",
    "paidById": "participant-id",
    "splits": [
      {
        "participantId": "participant-1-id",
        "amount": 25000
      },
      {
        "participantId": "participant-2-id",
        "amount": 25000
      }
    ]
  }'
```

**Nota:** Los montos se almacenan en centavos (50000 = 500.00 EUR)

### 4. Calcular balances

```bash
curl http://localhost:3000/trips/{tripId}/balances
```

**Respuesta:**
```json
[
  {
    "participantId": "participant-1-id",
    "participantName": "Juan Pérez",
    "balance": 5000
  },
  {
    "participantId": "participant-2-id",
    "participantName": "María García",
    "balance": -5000
  }
]
```

**Interpretación:**
- Balance positivo: le deben dinero
- Balance negativo: debe dinero
- Balance cero: está al día

### 5. Obtener transferencias simplificadas

```bash
curl http://localhost:3000/trips/{tripId}/settlements
```

**Respuesta:**
```json
{
  "settlements": [
    {
      "from": "María García",
      "to": "Juan Pérez",
      "amount": 5000
    }
  ]
}
```

## 📁 Estructura del Proyecto

```
app-gastos/
├── src/
│   ├── trips/              # Módulo de viajes
│   │   ├── entities/      # Entidad Trip
│   │   ├── dto/           # DTOs de request/response
│   │   ├── trips.controller.ts
│   │   ├── trips.service.ts
│   │   └── trips.module.ts
│   │
│   ├── participants/       # Módulo de participantes
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── participants.controller.ts
│   │   ├── participants.service.ts
│   │   └── participants.module.ts
│   │
│   ├── expenses/          # Módulo de gastos
│   │   ├── entities/      # Expense y ExpenseSplit
│   │   ├── dto/
│   │   ├── expenses.controller.ts
│   │   ├── expenses.service.ts
│   │   └── expenses.module.ts
│   │
│   ├── balances/          # Módulo de balances
│   │   ├── dto/
│   │   ├── utils/         # DebtSimplifier
│   │   ├── balances.controller.ts
│   │   ├── balances.service.ts
│   │   └── balances.module.ts
│   │
│   ├── common/            # Código compartido
│   │   ├── filters/      # Exception filters
│   │   └── exceptions/    # Excepciones personalizadas
│   │
│   ├── app.module.ts      # Módulo raíz
│   └── main.ts            # Punto de entrada
│
├── test/                  # Tests
├── package.json
├── tsconfig.json
└── README.md
```

## 🧩 Modelo de Dominio

```
Trip (Viaje)
 ├── 1..* Participant (Participante)
 └── 0..* Expense (Gasto)
          ├── paidBy → Participant
          └── 1..* ExpenseSplit (División)
                    └── participant → Participant
```

### Reglas de Negocio

- **Viaje**: Mínimo 2 participantes
- **Participante**: Nombre único dentro del viaje
- **Gasto**: 
  - Monto mayor a 0
  - Pagador debe ser participante del viaje
  - Al menos un split
  - Suma de splits = monto del gasto
- **Balance**: Se calcula en tiempo real (no se persiste)
  - Balance = Total pagado - Total consumido
  - Balance positivo = le deben
  - Balance negativo = debe

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests en modo watch
npm run test:watch

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 🔍 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev      # Inicia con hot-reload     # Formatea código con Prettier
```

## 🗄️ Base de Datos

### Desarrollo

El proyecto usa **SQLite** para desarrollo. La base de datos se crea automáticamente al iniciar la aplicación:

- Archivo: `gastos.db` (en la raíz del proyecto)
- Auto-sincronización: Habilitada (`synchronize: true`)
- Logging: Habilitado para ver las queries SQL

## 📝 Notas Importantes

- Los montos se almacenan en **centavos** (enteros) para evitar problemas de precisión con decimales
- Los balances se **calculan en tiempo real**, no se persisten en la base de datos
- El algoritmo de simplificación de deudas usa un enfoque **greedy** para minimizar transferencias
- La base de datos SQLite (`gastos.db`) está en `.gitignore` y no se versiona

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- [NestJS](https://nestjs.com/) - Framework increíble para Node.js
- [TypeORM](https://typeorm.io/) - ORM potente y flexible
- [Swagger](https://swagger.io/) - Documentación de API

---

**¿Tienes preguntas o sugerencias?** Abre un issue o crea un pull request. ¡Las contribuciones son bienvenidas! 🎉
