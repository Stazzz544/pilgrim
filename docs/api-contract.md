# Контракт API для бэкенда (Этап B)

Этот контракт уже реализует фронтенд, сейчас на демо-данных из `pilgrim_front/src/mocks`. Типы описаны в `pilgrim_front/src/shared/api/types.ts`, функции запросов — в `shared/api/events.ts` и `shared/api/content.ts`. При подключении бэкенда меняется только тело этих функций (на `fetch`), их сигнатуры остаются прежними.

## Соглашения

- База — `/api/v1/`. Все ответы в JSON.
- Ключи полей:
  - Django REST Framework отдаёт `snake_case`;
  - фронтенд работает в `camelCase`;
  - перевод выполняет `djangorestframework-camel-case` или маппер в `shared/api`.
- Даты: `YYYY-MM-DD` — календарный день без часового пояса. Время — `HH:MM`.
- Списки: стандартная пагинация DRF `{ count, next, previous, results }`.
- Фото: объект `Photo`, где `src` — полный размер (до 1600px), а `thumbSrc` — превью (до 760px). Миниатюры нарезает бэкенд.

## Эндпойнты

| Метод и путь                  | Что возвращает                                  | Параметры                                                     |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| `GET /events/`                | `Paginated<Event>`                              | `scope=upcoming\|archive`, `search`, `category` (несколько через запятую), `difficulty`, `ordering=start_date\|-start_date`, `page` |
| `GET /events/{slug}/`         | `Event`                                         | —                                                             |
| `GET /events/calendar/`       | `Event[]` для сетки календаря                   | `month=YYYY-MM`                                               |
| `GET /categories/`            | `Category[]`                                    | —                                                             |
| `GET /posts/`                 | `Paginated<Post>`, новые сверху                 | `page`                                                        |
| `GET /posts/{slug}/`          | `Post`                                          | —                                                             |
| `GET /albums/`                | `Paginated<Album>`, новые сверху                | `category`, `page`                                            |
| `GET /albums/{slug}/`         | `Album` с массивом `photos`                     | —                                                             |
| `GET /vk/posts/`              | `VkPost[]` — последние записи сообщества ВК     | `limit` (по умолчанию 3)                                      |
| `POST /donations/`            | `{ paymentUrl }` — ссылка на оплату у провайдера | `{ amount, recurring, email? }`                               |

### Редактирование (этапы 11 и B11–B12)

Пишут только вошедшие кураторы. Сессия Django и CSRF-токен работают на одном домене за Caddy.

| Метод и путь | Что делает |
| --- | --- |
| `POST /auth/login/`, `POST /auth/logout/`, `GET /auth/me/` | Вход, выход, текущий пользователь и его роль (`organizer` или `activist`) |
| `POST /events/`, `PATCH /events/{slug}/`, `DELETE /events/{slug}/` | Создать, изменить, удалить мероприятие. Перенос в архив — `PATCH` с `isArchived: true` |
| `POST /posts/`, `PATCH /posts/{slug}/`, `DELETE /posts/{slug}/` | То же для постов |
| `POST /albums/`, `PATCH /albums/{slug}/`, `DELETE /albums/{slug}/` | То же для альбомов |
| `POST /photos/` | Загрузка фото (multipart). Сервер нарезает WebP 1600/760 и возвращает `Photo` |

Активист может менять и удалять только записи со своим `authorId`, организатор — любые. Сервер проверяет права сам, а не полагается на интерфейс.

## Сущности

| Сущность   | Ключевые поля                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `Category` | `slug` (`outdoor`, `russia`, `international`, `sport`, `festivals`, `city`), `name`, `description`      |
| `Event`    | `slug`, `title`, `summary`, `description[]`, `startDate`, `endDate`, `startTime`, `location`, `region`, `meetingPoint`, `difficulty` (`easy\|medium\|hard`), `category`, `tags[]`, `cover`, `albumSlug`, `curator`, `price`, `groupSize`, `program[]`, `equipment[]`, `vkUrl` |
| `Post`     | `slug`, `title`, `excerpt`, `body[]`, `publishedAt`, `images[]`, `tags[]`, `eventSlug`                |
| `Album`    | `slug`, `title`, `description`, `category`, `date`, `eventSlug`, `cover`, `photos[]`                  |
| `VkPost`   | `id`, `text`, `publishedAt`, `image`, `likes`, `url`                                                  |

Общие поля `Event`, `Post` и `Album`:
- `authorId` — автор записи. Записи без автора правит только организатор.
- `publication` — `published` или `draft`. Черновики видят только кураторы.

## Архив

Мероприятие попадает в архив, когда `endDate` раньше сегодняшнего дня или куратор вручную поставил `isArchived: true`. В демо граница по дате считается на клиенте по текущей дате посетителя.
