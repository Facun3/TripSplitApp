# App de Gastos de Viaje

## 📌 Descripción
Aplicación colaborativa para gestionar **gastos compartidos durante un viaje con amigos**. Todos los participantes pueden cargar, editar y eliminar gastos, y la app calcula automáticamente los balances y las deudas finales.

El foco del proyecto está en el **modelado de dominio**, las **reglas de negocio** y una **API REST clara**, pensada como proyecto demostrativo de backend.

---

## 🎯 Objetivo
- Registrar gastos de un viaje compartido
- Dividir gastos de forma justa (igualitaria o personalizada)
- Calcular cuánto debe o le deben a cada participante
- Simplificar deudas con la menor cantidad de transferencias

---

## 🧑‍🤝‍🧑 Alcance del MVP
- App **colaborativa**: todos los viajeros pueden operar
- Sin autenticación ni roles
- Sin pagos reales (solo cálculo de deudas)

---

## 👥 Actores
- **Usuario**: cualquier participante del viaje

Todos los usuarios tienen los mismos permisos dentro del viaje.

---

## 📖 User Stories (Resumen)
- Crear un viaje
- Agregar participantes
- Registrar gastos
- Dividir gastos (igual o personalizado)
- Excluir participantes de un gasto
- Editar gastos
- Eliminar gastos
- Ver balance personal
- Ver balance general
- Ver deudas simplificadas

---

## 📘 Casos de Uso Principales
- Crear viaje
- Agregar participantes
- Registrar gasto
- Editar gasto
- Eliminar gasto
- Ver gastos del viaje
- Ver balance personal
- Ver balance general
- Ver deudas simplificadas

---

## 🧩 Modelo de Dominio

### Viaje (Trip)
- id
- name
- currency
- participants
- expenses

Reglas:
- Mínimo 2 participantes
- Todos los gastos pertenecen a un viaje

---

### Participante (Participant)
- id
- name

Reglas:
- Nombre único dentro del viaje
- Existe solo dentro del contexto del viaje

---

### Gasto (Expense)
- id
- description
- amount
- date
- paidBy (Participant)
- splits

Reglas:
- Monto mayor a 0
- El pagador debe ser participante del viaje
- Tiene al menos un split

---

### División de gasto (ExpenseSplit)
- id
- participant
- amount

Reglas:
- Monto mayor o igual a 0
- La suma de los splits debe ser igual al monto del gasto

---

## 🔗 Relaciones
```
Trip
 ├── 1..* Participant
 └── 0..* Expense
          ├── paidBy → Participant
          └── 1..* ExpenseSplit
                    └── participant → Participant
```

---

## 🌐 API REST (Resumen)

### Viajes
- POST /trips
- GET /trips/{tripId}

### Participantes
- POST /trips/{tripId}/participants
- GET /trips/{tripId}/participants

### Gastos
- POST /trips/{tripId}/expenses
- GET /trips/{tripId}/expenses
- GET /trips/{tripId}/expenses/{expenseId}
- PUT /trips/{tripId}/expenses/{expenseId}
- DELETE /trips/{tripId}/expenses/{expenseId}

### Balances
- GET /trips/{tripId}/balances
- GET /trips/{tripId}/settlements

---

## 🧮 Lógica de Cálculo

### Cálculo de balances
Para cada participante:
```
balance = total_pagado - total_consumido
```

- Balance > 0: le deben
- Balance < 0: debe
- Balance = 0: está al día

La suma de todos los balances siempre es 0.

---

### Simplificación de deudas
Algoritmo greedy:
- Separar acreedores y deudores
- Emparejar montos mínimos entre ambos
- Minimizar cantidad de transferencias

---

## ⚠️ Reglas Importantes
- Los balances **no se persisten**, se calculan
- Se usan montos enteros (centavos)
- Cualquier cambio en un gasto recalcula balances
- Todos los participantes pueden editar/eliminar gastos

---

## 🚫 Fuera de alcance (por ahora)
- Autenticación y usuarios reales
- Roles o permisos
- Pagos reales
- Historial de pagos

---

## 🧑‍💻 Enfoque del Proyecto
Este proyecto está diseñado para demostrar:
- Buen modelado de dominio
- Separación de responsabilidades
- Claridad en reglas de negocio
- Diseño de API REST coherente

Ideal como proyecto de portfolio backend.

---

## 🔜 Próximos pasos posibles
- Implementación en Java Spring Boot / .NET
- Tests unitarios para lógica de cálculo
- UI simple para consumo de la API
- Autenticación y roles

