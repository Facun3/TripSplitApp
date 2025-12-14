# Planificación de Implementación - App de Gastos con NestJS

## 📚 Tabla de Contenidos
1. [Conceptos Básicos de NestJS](#conceptos-básicos-de-nestjs)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Fases de Desarrollo](#fases-de-desarrollo)
4. [Configuración y Dependencias](#configuración-y-dependencias)
5. [Detalles de Implementación](#detalles-de-implementación)
6. [Consideraciones de Escalabilidad](#consideraciones-de-escalabilidad)

---

## 🎓 Conceptos Básicos de NestJS

### Mapeo de Conceptos: Spring Boot → NestJS

| Spring Boot | NestJS | Descripción |
|-------------|--------|-------------|
| `@RestController` | `@Controller()` | Define un controlador REST |
| `@Service` | `@Injectable()` | Servicio con lógica de negocio |
| `@Repository` | `@Injectable()` + TypeORM Repository | Acceso a datos |
| `@Entity` | `@Entity()` (TypeORM) | Entidad de base de datos |
| `@Autowired` | Constructor injection | Inyección de dependencias |
| `@Component` | `@Injectable()` | Componente inyectable |
| `@Module` | `@Module()` | Módulo (similar a @Configuration) |
| `@Valid` | `@UsePipes(ValidationPipe)` | Validación de DTOs |
| `@ExceptionHandler` | `@Catch()` + Exception Filters | Manejo de excepciones |

### Arquitectura NestJS

```
┌─────────────────────────────────────┐
│         Modules                     │
│  (Organizan la aplicación)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Controllers                  │
│  (REST endpoints - @Controller)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Services                     │
│  (Business Logic - @Injectable)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Repositories/Entities        │
│  (TypeORM - Data Access)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Database                     │
│  (SQLite/H2/PostgreSQL)             │
└─────────────────────────────────────┘
```

### Conceptos Clave

#### 1. Módulos (`@Module()`)
Agrupan funcionalidad relacionada:
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService], // Para usar en otros módulos
})
export class TripsModule {}
```

#### 2. Inyección de Dependencias
Similar a Spring, por constructor:
```typescript
@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}
}
```

#### 3. Decoradores Comunes
- `@Controller('trips')`: Define ruta base del controlador
- `@Get()`, `@Post()`, `@Put()`, `@Delete()`: Métodos HTTP
- `@Body()`, `@Param()`, `@Query()`: Parámetros de request
- `@Injectable()`: Marca clase como servicio/provider
- `@Entity()`: Marca clase como entidad TypeORM

#### 4. Pipes
Transforman y validan datos:
- `ValidationPipe`: Valida DTOs automáticamente
- Pipes personalizados para transformaciones

#### 5. Guards
Autenticación/autorización (no necesario en MVP)

#### 6. Interceptors
Lógica cross-cutting (logging, transformación de respuestas)

---

## 📁 Estructura del Proyecto

```
app-gastos/
├── src/
│   ├── main.ts                          # Punto de entrada
│   ├── app.module.ts                    # Módulo raíz
│   │
│   ├── trips/                           # Módulo de Viajes
│   │   ├── trips.module.ts
│   │   ├── trips.controller.ts
│   │   ├── trips.service.ts
│   │   ├── entities/
│   │   │   └── trip.entity.ts
│   │   ├── dto/
│   │   │   ├── create-trip.dto.ts
│   │   │   └── trip-response.dto.ts
│   │   └── trips.controller.spec.ts
│   │
│   ├── participants/                    # Módulo de Participantes
│   │   ├── participants.module.ts
│   │   ├── participants.controller.ts
│   │   ├── participants.service.ts
│   │   ├── entities/
│   │   │   └── participant.entity.ts
│   │   └── dto/
│   │       ├── add-participant.dto.ts
│   │       └── participant-response.dto.ts
│   │
│   ├── expenses/                        # Módulo de Gastos
│   │   ├── expenses.module.ts
│   │   ├── expenses.controller.ts
│   │   ├── expenses.service.ts
│   │   ├── entities/
│   │   │   ├── expense.entity.ts
│   │   │   └── expense-split.entity.ts
│   │   └── dto/
│   │       ├── create-expense.dto.ts
│   │       ├── update-expense.dto.ts
│   │       └── expense-response.dto.ts
│   │
│   ├── balances/                        # Módulo de Balances
│   │   ├── balances.module.ts
│   │   ├── balances.controller.ts
│   │   ├── balances.service.ts
│   │   ├── dto/
│   │   │   ├── balance-response.dto.ts
│   │   │   └── settlement-response.dto.ts
│   │   └── utils/
│   │       └── debt-simplifier.ts
│   │
│   ├── common/                          # Código compartido
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── decorators/
│   │
│   └── database/                        # Configuración DB
│       └── database.module.ts
│
├── test/                                # Tests
│   ├── app.e2e-spec.ts
│   └── ...
│
├── package.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

---

## 🚀 Fases de Desarrollo

### Fase 1: Configuración Inicial y Setup (Día 1-2)

#### Objetivos
- Crear proyecto NestJS
- Configurar TypeORM
- Configurar base de datos
- Estructura base

#### Tareas Detalladas

**1. Crear proyecto NestJS**
```bash
npm i -g @nestjs/cli
nest new app-gastos
cd app-gastos
```

**2. Instalar dependencias necesarias**
```bash
# TypeORM y base de datos
npm install @nestjs/typeorm typeorm
npm install sqlite3  # o pg para PostgreSQL

# Validación
npm install class-validator class-transformer

# Documentación
npm install @nestjs/swagger swagger-ui-express

# Testing
npm install --save-dev @nestjs/testing
```

**3. Crear estructura de módulos**
- Crear carpetas: `trips`, `participants`, `expenses`, `balances`
- Crear archivos base de cada módulo

**4. Configurar TypeORM en `app.module.ts`**
- Conexión a base de datos
- Importar módulos de entidades

#### Entregables
- ✅ Proyecto NestJS creado
- ✅ Dependencias instaladas
- ✅ Estructura de carpetas creada
- ✅ TypeORM configurado
- ✅ Base de datos SQLite funcionando

---

### Fase 2: Entidades y Modelo de Dominio (Día 3-4)

#### Objetivos
- Crear entidades TypeORM
- Definir relaciones
- Validaciones básicas

#### Tareas Detalladas

**1. Crear entidad `Trip` (`trips/entities/trip.entity.ts`)**
```typescript
@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ length: 3 })
  currency: string; // USD, EUR, etc.

  @OneToMany(() => Participant, participant => participant.trip, { cascade: true })
  participants: Participant[];

  @OneToMany(() => Expense, expense => expense.trip, { cascade: true })
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**2. Crear entidad `Participant` (`participants/entities/participant.entity.ts`)**
```typescript
@Entity('participants')
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Trip, trip => trip.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;

  @OneToMany(() => Expense, expense => expense.paidBy)
  paidExpenses: Expense[];

  @OneToMany(() => ExpenseSplit, split => split.participant)
  splits: ExpenseSplit[];
}
```

**3. Crear entidad `Expense` (`expenses/entities/expense.entity.ts`)**
```typescript
@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('bigint') // Almacenar en centavos
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Participant, participant => participant.paidExpenses)
  @JoinColumn({ name: 'paidById' })
  paidBy: Participant;

  @Column()
  paidById: string;

  @ManyToOne(() => Trip, trip => trip.expenses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: string;

  @OneToMany(() => ExpenseSplit, split => split.expense, { cascade: true })
  splits: ExpenseSplit[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**4. Crear entidad `ExpenseSplit` (`expenses/entities/expense-split.entity.ts`)**
```typescript
@Entity('expense_splits')
export class ExpenseSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Participant, participant => participant.splits)
  @JoinColumn({ name: 'participantId' })
  participant: Participant;

  @Column()
  participantId: string;

  @ManyToOne(() => Expense, expense => expense.splits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;

  @Column()
  expenseId: string;

  @Column('bigint') // Almacenar en centavos
  amount: number;
}
```

#### Conceptos Clave
- `@Entity()`: Marca una clase como entidad
- `@PrimaryGeneratedColumn()`: ID auto-generado
- `@Column()`: Columna de base de datos
- `@ManyToOne()`, `@OneToMany()`: Relaciones
- TypeORM Repository: Similar a JpaRepository

#### Entregables
- ✅ Todas las entidades creadas
- ✅ Relaciones definidas correctamente
- ✅ Validaciones básicas implementadas

---

### Fase 3: DTOs y Validaciones (Día 5)

#### Objetivos
- Crear DTOs de request/response
- Implementar validaciones con `class-validator`

#### Tareas Detalladas

**1. DTOs de Trip**
```typescript
// create-trip.dto.ts
export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;
}

// trip-response.dto.ts
export class TripResponseDto {
  id: string;
  name: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**2. DTOs de Participant**
```typescript
// add-participant.dto.ts
export class AddParticipantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}

// participant-response.dto.ts
export class ParticipantResponseDto {
  id: string;
  name: string;
  tripId: string;
}
```

**3. DTOs de Expense**
```typescript
// create-expense.dto.ts
export class ExpenseSplitDto {
  @IsUUID()
  participantId: string;

  @IsNumber()
  @Min(0)
  amount: number; // en centavos
}

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(1)
  amount: number; // en centavos

  @IsDateString()
  date: string;

  @IsUUID()
  paidById: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  @ArrayMinSize(1)
  splits: ExpenseSplitDto[];
}

// update-expense.dto.ts
export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  amount?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsUUID()
  @IsOptional()
  paidById?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExpenseSplitDto)
  @IsOptional()
  splits?: ExpenseSplitDto[];
}
```

**4. DTOs de Balance**
```typescript
// balance-response.dto.ts
export class BalanceResponseDto {
  participantId: string;
  participantName: string;
  balance: number; // en centavos (positivo = le deben, negativo = debe)
}

// settlement-response.dto.ts
export class SettlementDto {
  from: string; // nombre del participante que debe
  to: string; // nombre del participante al que le deben
  amount: number; // en centavos
}

export class SettlementResponseDto {
  settlements: SettlementDto[];
}
```

#### Conceptos Clave
- DTOs: Data Transfer Objects
- `class-validator`: `@IsString()`, `@IsNumber()`, `@Min()`, `@Max()`
- `ValidationPipe`: Valida automáticamente los DTOs

#### Entregables
- ✅ Todos los DTOs creados
- ✅ Validaciones implementadas
- ✅ Transformaciones configuradas

---

### Fase 4: Servicios y Lógica de Negocio (Día 6-8)

#### Objetivos
- Implementar servicios con reglas de negocio
- Inyección de dependencias
- Cálculo de balances

#### Tareas Detalladas

**1. `TripsService`**
```typescript
@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    const trip = this.tripRepository.create(createTripDto);
    return this.tripRepository.save(trip);
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['participants', 'expenses'],
    });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }
}
```

**2. `ParticipantsService`**
```typescript
@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    private tripsService: TripsService,
  ) {}

  async addParticipant(tripId: string, dto: AddParticipantDto): Promise<Participant> {
    // Validar que el viaje existe
    await this.tripsService.findOne(tripId);

    // Validar nombre único
    const existing = await this.participantRepository.findOne({
      where: { tripId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Participant with name ${dto.name} already exists in this trip`);
    }

    const participant = this.participantRepository.create({
      ...dto,
      tripId,
    });
    return this.participantRepository.save(participant);
  }

  async findAllByTrip(tripId: string): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { tripId },
    });
  }
}
```

**3. `ExpensesService`**
```typescript
@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private splitRepository: Repository<ExpenseSplit>,
    private tripsService: TripsService,
  ) {}

  async create(tripId: string, dto: CreateExpenseDto): Promise<Expense> {
    // Validar que el viaje existe
    const trip = await this.tripsService.findOne(tripId);

    // Validar que el pagador pertenece al viaje
    const paidBy = await this.validateParticipantInTrip(tripId, dto.paidById);

    // Validar suma de splits
    const totalSplits = dto.splits.reduce((sum, split) => sum + split.amount, 0);
    if (totalSplits !== dto.amount) {
      throw new BadRequestException(
        `Sum of splits (${totalSplits}) must equal expense amount (${dto.amount})`,
      );
    }

    // Validar que todos los participantes de splits pertenecen al viaje
    for (const split of dto.splits) {
      await this.validateParticipantInTrip(tripId, split.participantId);
    }

    const expense = this.expenseRepository.create({
      ...dto,
      tripId,
      date: new Date(dto.date),
    });

    const savedExpense = await this.expenseRepository.save(expense);

    // Crear splits
    const splits = dto.splits.map(split =>
      this.splitRepository.create({
        expenseId: savedExpense.id,
        participantId: split.participantId,
        amount: split.amount,
      }),
    );
    await this.splitRepository.save(splits);

    return this.findOne(tripId, savedExpense.id);
  }

  async findAllByTrip(tripId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { tripId },
      relations: ['paidBy', 'splits', 'splits.participant'],
      order: { date: 'DESC' },
    });
  }

  async findOne(tripId: string, expenseId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id: expenseId, tripId },
      relations: ['paidBy', 'splits', 'splits.participant'],
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${expenseId} not found`);
    }
    return expense;
  }

  async update(tripId: string, expenseId: string, dto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(tripId, expenseId);

    // Validaciones similares a create
    if (dto.amount !== undefined || dto.splits !== undefined) {
      const amount = dto.amount ?? expense.amount;
      const splits = dto.splits ?? expense.splits.map(s => ({
        participantId: s.participantId,
        amount: s.amount,
      }));

      const totalSplits = splits.reduce((sum, split) => sum + split.amount, 0);
      if (totalSplits !== amount) {
        throw new BadRequestException(
          `Sum of splits (${totalSplits}) must equal expense amount (${amount})`,
        );
      }
    }

    // Actualizar expense
    Object.assign(expense, dto);
    if (dto.date) {
      expense.date = new Date(dto.date);
    }
    await this.expenseRepository.save(expense);

    // Si se actualizaron splits, eliminarlos y recrearlos
    if (dto.splits) {
      await this.splitRepository.delete({ expenseId });
      const newSplits = dto.splits.map(split =>
        this.splitRepository.create({
          expenseId,
          participantId: split.participantId,
          amount: split.amount,
        }),
      );
      await this.splitRepository.save(newSplits);
    }

    return this.findOne(tripId, expenseId);
  }

  async remove(tripId: string, expenseId: string): Promise<void> {
    const expense = await this.findOne(tripId, expenseId);
    await this.expenseRepository.remove(expense);
  }

  private async validateParticipantInTrip(tripId: string, participantId: string): Promise<Participant> {
    // Implementar validación
  }
}
```

**4. `BalancesService`**
```typescript
@Injectable()
export class BalancesService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseSplit)
    private splitRepository: Repository<ExpenseSplit>,
  ) {}

  async calculateBalances(tripId: string): Promise<BalanceResponseDto[]> {
    const participants = await this.participantRepository.find({
      where: { tripId },
    });

    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: ['paidBy', 'splits'],
    });

    const balances = participants.map(participant => {
      // Total pagado
      const totalPaid = expenses
        .filter(e => e.paidById === participant.id)
        .reduce((sum, e) => sum + e.amount, 0);

      // Total consumido
      const totalConsumed = expenses
        .flatMap(e => e.splits)
        .filter(s => s.participantId === participant.id)
        .reduce((sum, s) => sum + s.amount, 0);

      const balance = totalPaid - totalConsumed;

      return {
        participantId: participant.id,
        participantName: participant.name,
        balance,
      };
    });

    return balances;
  }

  async calculateSettlements(tripId: string): Promise<SettlementResponseDto> {
    const balances = await this.calculateBalances(tripId);
    const settlements = DebtSimplifier.simplify(balances);
    return { settlements };
  }
}
```

**5. `DebtSimplifier` (utils/debt-simplifier.ts)**
```typescript
export class DebtSimplifier {
  static simplify(balances: BalanceResponseDto[]): SettlementDto[] {
    const creditors = balances.filter(b => b.balance > 0).sort((a, b) => b.balance - a.balance);
    const debtors = balances.filter(b => b.balance < 0).sort((a, b) => a.balance - b.balance);

    const settlements: SettlementDto[] = [];
    let creditorIndex = 0;
    let debtorIndex = 0;

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex];
      const debtor = debtors[debtorIndex];

      const creditorBalance = creditor.balance;
      const debtorDebt = Math.abs(debtor.balance);

      const amount = Math.min(creditorBalance, debtorDebt);

      settlements.push({
        from: debtor.participantName,
        to: creditor.participantName,
        amount,
      });

      creditor.balance -= amount;
      debtor.balance += amount;

      if (creditor.balance === 0) creditorIndex++;
      if (debtor.balance === 0) debtorIndex++;
    }

    return settlements;
  }
}
```

#### Conceptos Clave
- `@Injectable()`: Marca servicio como inyectable
- Constructor injection: Inyectar dependencias
- Repository pattern: Acceso a datos
- Transacciones: `@Transactional()` (TypeORM)

#### Entregables
- ✅ Todos los servicios implementados
- ✅ Reglas de negocio validadas
- ✅ Cálculo de balances funcionando
- ✅ Algoritmo de simplificación implementado

---

### Fase 5: Controllers y API REST (Día 9-11)

#### Objetivos
- Implementar endpoints REST
- Manejo de parámetros
- Respuestas HTTP correctas

#### Tareas Detalladas

**1. `TripsController`**
```typescript
@Controller('trips')
@ApiTags('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiResponse({ status: 201, description: 'Trip created successfully' })
  async create(@Body() createTripDto: CreateTripDto): Promise<TripResponseDto> {
    const trip = await this.tripsService.create(createTripDto);
    return this.toResponseDto(trip);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip by ID' })
  @ApiResponse({ status: 200, description: 'Trip found' })
  @ApiResponse({ status: 404, description: 'Trip not found' })
  async findOne(@Param('id') id: string): Promise<TripResponseDto> {
    const trip = await this.tripsService.findOne(id);
    return this.toResponseDto(trip);
  }

  private toResponseDto(trip: Trip): TripResponseDto {
    return {
      id: trip.id,
      name: trip.name,
      currency: trip.currency,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }
}
```

**2. `ParticipantsController`**
```typescript
@Controller('trips/:tripId/participants')
@ApiTags('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  @ApiOperation({ summary: 'Add participant to trip' })
  async create(
    @Param('tripId') tripId: string,
    @Body() addParticipantDto: AddParticipantDto,
  ): Promise<ParticipantResponseDto> {
    const participant = await this.participantsService.addParticipant(tripId, addParticipantDto);
    return this.toResponseDto(participant);
  }

  @Get()
  @ApiOperation({ summary: 'Get all participants of a trip' })
  async findAll(@Param('tripId') tripId: string): Promise<ParticipantResponseDto[]> {
    const participants = await this.participantsService.findAllByTrip(tripId);
    return participants.map(p => this.toResponseDto(p));
  }

  private toResponseDto(participant: Participant): ParticipantResponseDto {
    return {
      id: participant.id,
      name: participant.name,
      tripId: participant.tripId,
    };
  }
}
```

**3. `ExpensesController`**
```typescript
@Controller('trips/:tripId/expenses')
@ApiTags('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  async create(
    @Param('tripId') tripId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.create(tripId, createExpenseDto);
    return this.toResponseDto(expense);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses of a trip' })
  async findAll(@Param('tripId') tripId: string): Promise<ExpenseResponseDto[]> {
    const expenses = await this.expensesService.findAllByTrip(tripId);
    return expenses.map(e => this.toResponseDto(e));
  }

  @Get(':expenseId')
  @ApiOperation({ summary: 'Get expense by ID' })
  async findOne(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.findOne(tripId, expenseId);
    return this.toResponseDto(expense);
  }

  @Put(':expenseId')
  @ApiOperation({ summary: 'Update expense' })
  async update(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.expensesService.update(tripId, expenseId, updateExpenseDto);
    return this.toResponseDto(expense);
  }

  @Delete(':expenseId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete expense' })
  async remove(
    @Param('tripId') tripId: string,
    @Param('expenseId') expenseId: string,
  ): Promise<void> {
    await this.expensesService.remove(tripId, expenseId);
  }

  private toResponseDto(expense: Expense): ExpenseResponseDto {
    return {
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      paidBy: {
        id: expense.paidBy.id,
        name: expense.paidBy.name,
      },
      splits: expense.splits.map(s => ({
        participantId: s.participantId,
        participantName: s.participant.name,
        amount: s.amount,
      })),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }
}
```

**4. `BalancesController`**
```typescript
@Controller('trips/:tripId')
@ApiTags('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('balances')
  @ApiOperation({ summary: 'Get balances for all participants' })
  async getBalances(@Param('tripId') tripId: string): Promise<BalanceResponseDto[]> {
    return this.balancesService.calculateBalances(tripId);
  }

  @Get('settlements')
  @ApiOperation({ summary: 'Get simplified debt settlements' })
  async getSettlements(@Param('tripId') tripId: string): Promise<SettlementResponseDto> {
    return this.balancesService.calculateSettlements(tripId);
  }
}
```

#### Conceptos Clave
- `@Controller()`: Define un controlador
- `@Get()`, `@Post()`, `@Put()`, `@Delete()`: Métodos HTTP
- `@Body()`, `@Param()`, `@Query()`: Parámetros
- `@HttpCode()`, `@Header()`: Respuestas HTTP

#### Entregables
- ✅ Todos los controllers implementados
- ✅ Endpoints REST funcionando
- ✅ Documentación Swagger configurada

---

### Fase 6: Manejo de Excepciones (Día 12)

#### Objetivos
- Exception filters personalizados
- Respuestas de error consistentes

#### Tareas Detalladas

**1. Crear excepciones personalizadas**
```typescript
// common/exceptions/resource-not-found.exception.ts
export class ResourceNotFoundException extends NotFoundException {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
  }
}

// common/exceptions/business-rule.exception.ts
export class BusinessRuleException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}
```

**2. Crear `HttpExceptionFilter`**
```typescript
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

**3. Configurar globalmente en `main.ts`**
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('App de Gastos API')
    .setDescription('API para gestionar gastos compartidos en viajes')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
```

#### Conceptos Clave
- `@Catch()`: Exception filter
- `HttpException`: Excepciones HTTP
- Exception filters globales

#### Entregables
- ✅ Excepciones personalizadas creadas
- ✅ Exception filter implementado
- ✅ Respuestas de error consistentes

---

### Fase 7: Testing (Día 13-15)

#### Objetivos
- Tests unitarios de servicios
- Tests de integración de controllers
- Cobertura adecuada

#### Tareas Detalladas

**1. Tests unitarios de servicios**
```typescript
describe('TripsService', () => {
  let service: TripsService;
  let repository: Repository<Trip>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        {
          provide: getRepositoryToken(Trip),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
    repository = module.get<Repository<Trip>>(getRepositoryToken(Trip));
  });

  it('should create a trip', async () => {
    const dto = { name: 'Test Trip', currency: 'USD' };
    const trip = { id: '1', ...dto } as Trip;

    jest.spyOn(repository, 'create').mockReturnValue(trip as any);
    jest.spyOn(repository, 'save').mockResolvedValue(trip);

    const result = await service.create(dto);
    expect(result).toEqual(trip);
  });
});
```

**2. Tests de integración**
```typescript
describe('TripsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/trips (POST)', () => {
    return request(app.getHttpServer())
      .post('/trips')
      .send({ name: 'Test Trip', currency: 'USD' })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Test Trip');
      });
  });
});
```

#### Conceptos Clave
- `@nestjs/testing`: Utilidades de testing
- `Test.createTestingModule()`: Módulo de prueba
- Mocks: Simular dependencias

#### Entregables
- ✅ Tests unitarios de servicios
- ✅ Tests de integración de controllers
- ✅ Cobertura >= 80%

---

### Fase 8: Documentación y Finalización (Día 16-17)

#### Objetivos
- Documentación Swagger/OpenAPI
- README completo
- Ajustes finales

#### Tareas Detalladas

**1. Configurar Swagger**
- `@ApiTags()` en controllers
- `@ApiOperation()` en métodos
- `@ApiProperty()` en DTOs

**2. Crear README**
- Instrucciones de instalación
- Configuración
- Ejemplos de uso
- Endpoints documentados

**3. Revisión final**
- Refactoring
- Optimizaciones
- Código limpio

#### Entregables
- ✅ Documentación Swagger completa
- ✅ README con instrucciones
- ✅ Proyecto listo para usar

---

## ⚙️ Configuración y Dependencias

### package.json

```json
{
  "name": "app-gastos",
  "version": "1.0.0",
  "description": "App de gestión de gastos compartidos en viajes",
  "author": "",
  "private": true,
  "license": "MIT",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.1.0",
    "@nestjs/typeorm": "^10.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.17",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### Configuración TypeORM (app.module.ts)

```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'gastos.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    TripsModule,
    ParticipantsModule,
    ExpensesModule,
    BalancesModule,
  ],
})
export class AppModule {}
```

---

## 🔍 Detalles de Implementación

### Reglas de Negocio a Implementar

1. **Viaje**
   - Mínimo 2 participantes
   - Validar al crear/agregar participantes

2. **Participante**
   - Nombre único dentro del viaje
   - Validar antes de crear

3. **Gasto**
   - Monto > 0
   - Pagador debe ser participante del viaje
   - Al menos un split
   - Suma de splits = monto del gasto

4. **ExpenseSplit**
   - Monto >= 0
   - Participante debe pertenecer al viaje

5. **Balances**
   - Se calculan, no se persisten
   - Recalcular en cada request

6. **Montos**
   - Enteros (centavos)
   - Usar `bigint` en base de datos

### Validaciones

- Bean Validation en DTOs con `class-validator`
- Validaciones de negocio en servicios
- Manejo de excepciones consistente

### Performance

- Cálculo de balances en memoria (no persistir)
- Índices en claves foráneas
- Lazy loading donde corresponda

---

## 📈 Consideraciones de Escalabilidad

### Para el MVP (Actual)
- ✅ Estructura modular
- ✅ SQLite para desarrollo
- ✅ Cálculos en memoria
- ✅ Sin autenticación

### Para Producción (Futuro)
- PostgreSQL en lugar de SQLite
- Caché (Redis) para balances
- Paginación en listados
- Índices en base de datos
- Logging estructurado
- Health checks
- Rate limiting
- Background jobs para cálculos pesados
- Autenticación/autorización

### Roadmap de Escalabilidad

**Fase 1: MVP** (Actual)
- Estructura modular
- SQLite
- Cálculos en memoria

**Fase 2: Producción Básica**
- PostgreSQL
- Migraciones
- Logging
- Health checks
- Paginación

**Fase 3: Optimización**
- Caché para balances
- Índices
- Rate limiting
- Background jobs

**Fase 4: Escalado Avanzado**
- Autenticación
- Materialización de balances
- Monitoreo
- Microservicios (si es necesario)

---

## ✅ Criterios de Aceptación

- [ ] Todas las entidades con relaciones correctas
- [ ] Reglas de negocio implementadas y validadas
- [ ] Endpoints REST funcionando según especificación
- [ ] Cálculo de balances correcto
- [ ] Algoritmo de simplificación funcionando
- [ ] Cobertura de tests >= 80%
- [ ] Documentación API completa
- [ ] Código limpio y bien estructurado

---

## 📝 Notas Finales

Esta planificación está diseñada para:
- Aprender NestJS desde cero
- Implementar un MVP funcional
- Mantener código limpio y escalable
- Facilitar futuras mejoras

El proyecto puede escalarse agregando las mejoras mencionadas cuando sea necesario, manteniendo la arquitectura modular como base sólida.

