# Meeting Booking

Веб-додаток для бронювання переговорних кімнат. Користувачі створюють кімнати, додають до них колег за email з ролями та бронюють кімнати на конкретний час. Бронювання однієї кімнати не можуть перетинатися.

## Можливості

- **Акаунти** — реєстрація та вхід, сесія в `httpOnly` cookie з JWT, паролі хешуються bcrypt.
- **Кімнати** — створення, редагування, видалення. Творець автоматично стає адміном.
- **Учасники** — додавання колег за email з роллю `ADMIN` або `USER`, зміна ролі, видалення. Ролі прив'язані до кімнати: можна бути адміном в одній і учасником в іншій.
- **Бронювання** — створення на дату й час, редагування, скасування. Перевірка конфліктів часу: інтервали перетинаються, якщо `newStart < existingEnd && newEnd > existingStart`.
- **Участь** — будь-який учасник кімнати може долучитися до бронювання або вийти з нього.

| Дія | `ADMIN` | `USER` |
|---|:---:|:---:|
| Переглядати кімнату, учасників, бронювання | ✅ | ✅ |
| Долучатися до бронювань / виходити з них | ✅ | ✅ |
| Редагувати / видаляти кімнату | ✅ | ❌ |
| Керувати учасниками | ✅ | ❌ |
| Створювати / редагувати / скасовувати бронювання | ✅ | ❌ |

Права перевіряє бекенд, фронтенд лише ховає недоступні дії.

## Стек

| Частина | Технології |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, TanStack Query, axios, react-hook-form + zod |
| **Backend** | NestJS 12, TypeScript, Prisma 7, PostgreSQL, JWT, bcrypt, class-validator |

## Структура репозиторію

```
.
├── meeting-booking-client/   # Next.js — інтерфейс
├── meeting-booking-server/   # NestJS — REST API
└── README.md
```

Детальніше про кожну частину:

- [Frontend README](meeting-booking-client/README.md) — сторінки, автентифікація, як читаються дані, структура.
- [Backend README](meeting-booking-server/README.md) — API-ендпоінти, правила бронювання, коди відповідей.

## Швидкий старт

### 1. Вимоги

- Node.js 24+
- pnpm 10+
- Docker (для PostgreSQL) або локальний PostgreSQL 16+

### 2. База даних

```bash
docker run -d --name booking-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=booking \
  -p 5432:5432 \
  postgres:16
```

### 3. Backend

```bash
cd meeting-booking-server
cp .env.example .env
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm start:dev              # http://localhost:3001
```

### 4. Frontend

В окремому терміналі:

```bash
cd meeting-booking-client
cp .env.example .env
pnpm install
pnpm dev                    # http://localhost:3000
```

Відкрийте [http://localhost:3000](http://localhost:3000) і зареєструйтеся.

## Змінні оточення

| Частина | Змінна | Опис | Значення за замовчуванням |
|---|---|---|---|
| Backend | `PORT` | порт API | `3001` |
| Backend | `DATABASE_URL` | рядок підключення до PostgreSQL | `postgresql://postgres:secret@localhost:5432/booking?schema=public` |
| Backend | `JWT_SECRET` | секрет для підпису токенів | — |
| Backend | `JWT_EXPIRES_IN` | термін дії токена | `1d` |
| Backend | `CLIENT_URL` | адреса фронтенду для CORS | `http://localhost:3000` |
| Frontend | `NEXT_PUBLIC_API_URL` | адреса бекенду | `http://localhost:3001` |

`CLIENT_URL` на бекенді має точно збігатися з адресою фронтенду, інакше браузер заблокує запити через CORS.

## Як перевірити основний сценарій

1. Зареєструйте два акаунти (наприклад, у звичайному вікні та в інкогніто).
2. Першим акаунтом створіть кімнату — ви стали її адміном.
3. Додайте другий акаунт за email з роллю `USER`.
4. Створіть бронювання, а потім спробуйте створити друге на час, що перетинається, — отримаєте повідомлення про конфлікт.
5. Другим акаунтом відкрийте кімнату: кнопок керування немає, але можна долучитися до бронювання.

## Що можна покращити

- `docker-compose` для запуску всього стеку однією командою.
- Refresh-токени з ротацією.
- Захист від одночасного бронювання того самого слоту на рівні БД (`EXCLUDE USING gist`).
- Календарний вигляд бронювань і підказка вільних слотів.
- e2e-тести на сценарії з ролями й конфліктами.
- Swagger-документація API.
