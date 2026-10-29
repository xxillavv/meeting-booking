# Meeting Booking — Backend

REST API для бронювання переговорних кімнат. Користувачі створюють кімнати, додають до них колег за email з ролями та бронюють кімнати на конкретний час із перевіркою конфліктів.

## Стек

- **NestJS 12** + **TypeScript** (strict, ESM)
- **Prisma 7** + **PostgreSQL** (driver adapter `@prisma/adapter-pg`)
- **JWT** (`@nestjs/jwt`) в `httpOnly` cookie
- **bcrypt** для хешування паролів
- **class-validator** / **class-transformer** для валідації DTO

## Швидкий старт

### 1. Вимоги

- Node.js 24+
- pnpm 10+
- PostgreSQL 16+ (локально або в Docker)

### 2. Змінні оточення

```bash
cp .env.example .env
```

| Змінна | Опис | Приклад |
|---|---|---|
| `PORT` | порт API | `3001` |
| `DATABASE_URL` | рядок підключення до PostgreSQL | `postgresql://postgres:secret@localhost:5432/booking?schema=public` |
| `JWT_SECRET` | секрет для підпису токенів | довгий випадковий рядок |
| `JWT_EXPIRES_IN` | термін дії токена | `1d` |
| `CLIENT_URL` | адреса фронтенду для CORS (необов'язково) | `http://localhost:3000` |

### 3. База даних

Якщо PostgreSQL ще немає, найпростіше підняти його в Docker:

```bash
docker run -d --name booking-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=booking \
  -p 5432:5432 \
  postgres:16
```

### 4. Встановлення та запуск

```bash
pnpm install
pnpm prisma generate        # генерує Prisma Client у src/generated
pnpm prisma migrate dev     # застосовує міграції
pnpm start:dev              # http://localhost:3001
```

## Скрипти

| Команда | Що робить |
|---|---|
| `pnpm start:dev` | запуск у режимі розробки з hot reload |
| `pnpm build` | збірка в `dist/` |
| `pnpm start:prod` | запуск зібраної версії |
| `pnpm lint` | перевірка коду (oxlint) |
| `pnpm prisma migrate dev` | створити / застосувати міграції |
| `pnpm prisma studio` | переглянути базу в браузері |

## Docker

```bash
docker build -t meeting-booking-server .

docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://postgres:secret@host.docker.internal:5432/booking?schema=public \
  -e JWT_SECRET=change-me \
  -e JWT_EXPIRES_IN=1d \
  meeting-booking-server
```

Під час старту контейнер сам застосовує міграції (`prisma migrate deploy`).

## Автентифікація

Після реєстрації або логіну сервер ставить cookie `access_token` (`httpOnly`, `sameSite=lax`). Усі захищені ендпоінти читають токен із неї, тому фронтенд має надсилати запити з `credentials: 'include'`.

## Ролі

Ролі прив'язані до конкретної кімнати: користувач може бути `ADMIN` в одній кімнаті й `USER` в іншій. Творець кімнати автоматично стає `ADMIN`.

| Дія | `ADMIN` | `USER` |
|---|:---:|:---:|
| Переглядати кімнату, учасників, бронювання | ✅ | ✅ |
| Долучатися до бронювань / виходити з них | ✅ | ✅ |
| Редагувати / видаляти кімнату | ✅ | ❌ |
| Керувати учасниками кімнати | ✅ | ❌ |
| Створювати / редагувати / скасовувати бронювання | ✅ | ❌ |

Користувач, який не є учасником кімнати, отримує `404`: так не розкривається навіть факт існування кімнати.

## API

Усі ендпоінти, крім `register` і `login`, потребують автентифікації.

### Auth

| Метод | Ендпоінт | Опис |
|---|---|---|
| `POST` | `/auth/register` | реєстрація `{ name, email, password }` |
| `POST` | `/auth/login` | вхід `{ email, password }` |
| `POST` | `/auth/logout` | вихід (очищує cookie) |

### Users

| Метод | Ендпоінт | Опис |
|---|---|---|
| `GET` | `/users/me` | поточний користувач |

### Rooms

| Метод | Ендпоінт | Хто | Опис |
|---|---|---|---|
| `POST` | `/rooms` | будь-хто | створити кімнату `{ name, description? }` |
| `GET` | `/rooms` | будь-хто | мої кімнати з моєю роллю |
| `GET` | `/rooms/:id` | учасник | кімната |
| `PATCH` | `/rooms/:id` | `ADMIN` | оновити кімнату |
| `DELETE` | `/rooms/:id` | `ADMIN` | видалити кімнату |
| `GET` | `/rooms/:id/members` | учасник | учасники кімнати |
| `POST` | `/rooms/:id/members` | `ADMIN` | додати учасника `{ email, role }` |
| `PATCH` | `/rooms/:id/members/:userId` | `ADMIN` | змінити роль `{ role }` |
| `DELETE` | `/rooms/:id/members/:userId` | `ADMIN` | видалити учасника |

### Bookings

| Метод | Ендпоінт | Хто | Опис |
|---|---|---|---|
| `GET` | `/bookings?roomId=` | учасник | поточні й майбутні бронювання кімнати |
| `POST` | `/bookings` | `ADMIN` | створити `{ roomId, startTime, endTime, description? }` |
| `PATCH` | `/bookings/:id` | `ADMIN` | змінити час або опис |
| `DELETE` | `/bookings/:id` | `ADMIN` | скасувати бронювання |
| `POST` | `/bookings/:id/participants` | учасник | долучитися до бронювання |
| `DELETE` | `/bookings/:id/participants` | учасник | вийти з бронювання |

Дати передаються у форматі ISO 8601, наприклад `2026-10-30T14:00:00.000Z`.

### Правила бронювання

- `startTime` має бути раніше за `endTime`.
- Не можна створити бронювання в минулому.
- Бронювання однієї кімнати не можуть перетинатися: інтервали конфліктують, якщо `newStart < existingEnd && newEnd > existingStart`. При редагуванні саме бронювання з перевірки виключається.
- Творець бронювання автоматично стає його учасником.

### Коди відповідей

| Код | Коли |
|---|---|
| `400` | невалідні дані, некоректний час, спроба прибрати останнього `ADMIN` |
| `401` | немає або прострочений токен, невірний логін / пароль |
| `403` | недостатньо прав у кімнаті |
| `404` | ресурс не знайдено або немає доступу до кімнати |
| `409` | email зайнятий, учасник уже доданий, конфлікт часу бронювання |

## Структура

```
prisma/
├── schema.prisma           # generator + datasource
├── models/                 # моделі, розбиті по файлах
└── migrations/
src/
├── auth/                   # реєстрація, логін, JWT guard
├── users/                  # поточний користувач
├── rooms/                  # кімнати, учасники, перевірка ролей (RoomAccessService)
├── bookings/               # бронювання, конфлікти часу, участь
└── prisma/                 # PrismaService / PrismaModule
```

## Що можна покращити

- Refresh-токени з ротацією.
- Захист від одночасного бронювання того самого слоту на рівні БД (exclusion constraint `EXCLUDE USING gist` або транзакція з `Serializable`).
- e2e-тести на сценарії з ролями й конфліктами.
- Swagger-документація.
- Менший Docker-образ (лише production-залежності).
