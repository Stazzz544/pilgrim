# План бэкенда (этап B), итерация 1

## Context

Пользователь спрашивает, готовы ли мы писать бэкенд по ТЗ.

**Ответ: к разработке — да, к запуску — нет.**

Что уже готово:
- **Контракт API:** `docs/api-contract.md` описывает чтение, запись и роли.
- **Типы:** `pilgrim_front/src/shared/api/types.ts`.
- **Слой запросов** с фиксированными сигнатурами: `shared/api/events.ts`, `shared/api/content.ts`.
- **Интерфейс редактора** (этап 11): формы, загрузка фото, роли. Сейчас данные лежат в IndexedDB, в итерации переводим на API.
- **План этапа B** в `ROADMAP.md`: хостинг AdminVPS Promo, Caddy + Next + Django + Postgres в Docker Compose.

Что блокирует запуск, но не разработку (пункт B0 роадмапа):
- купить сервер и домен (B7);
- выбрать платёжный сервис и заключить договор (B5);
- согласовать с заказчиком демо и отходы от ТЗ (редактор на сайте, фото главного экрана);
- получить короткий адрес сообщества ВК (B6).

Ответы пользователя:
- **Окружение:** Python 3.13 и пакеты ставим через `uv` (он есть, а Python, Docker и Postgres на машине отсутствуют).
- **База:** локально SQLite, в CI и на сервере PostgreSQL.
- **Тесты:** пишем тесты API на pytest, как требует ТЗ.

Оценка: **XL**, делим на 4 сессии, `/clear` между ними. Итерация 1 обходится без сервера. Деплой, платежи, ВК, бэкапы и мониторинг — следующая итерация, после B0.

## Объём итерации 1

| Сессия | Что делаем | Пункты роадмапа |
| --- | --- | --- |
| S1 | Каркас Django, модели, админка, медиа, API чтения, сид из моков, тесты чтения | B1, B2, B3 |
| S2 | Вход и роли, API записи, загрузка фото, тесты прав | B11, B12 (бэк) |
| S3 | Фронт в двух режимах: демо на моках и боевой на API. Редактор поверх API, сброс кэша | B4, B12 (фронт) |
| S4 | Dockerfile, `docker-compose.yml`, Caddyfile, `.env.example`, CI бэка, сборка образов в GHCR | B7 (файлы), B8 (без деплоя) |

## Бэкенд — `pilgrim_back/`

**Стек:** Django 5.2 LTS, DRF, django-filter, Pillow, psycopg 3, gunicorn, django-unfold, django-axes, pytest + pytest-django, ruff. Точные версии сверить на PyPI при `uv add`. Зависимости в `pyproject.toml` и `uv.lock`. Настройки через переменные окружения: `DATABASE_URL` (по умолчанию SQLite), `SECRET_KEY`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, `REVALIDATE_URL`/`REVALIDATE_SECRET`, `TIME_ZONE=Europe/Moscow`.

**Структура:**
- `config/` — settings, urls, wsgi;
- `apps/accounts` — пользователь, роли, auth-эндпойнты;
- `apps/media` — Photo и нарезка;
- `apps/catalog` — Category и Event;
- `apps/blog` — Post и PostImage;
- `apps/gallery` — Album и AlbumPhoto;
- `apps/core` — общие права, пагинация, сброс кэша фронта.

**Модели по типам фронта.** Поля называются как в `types.ts`, но в snake_case. Списки (`description`, `tags`, `program`, `equipment`, `body`) хранятся в `JSONField` — так одна схема работает и в SQLite, и в PostgreSQL.
- **Photo:** WebP 1600 и 760 px, `width`, `height`, `alt`, `author`, `license`, `source_url`, `uploaded_by`.
- **Event:** `cover` → Photo, `category` → Category, `author` → User, `publication` (`draft`/`published`), `is_archived`.
- **Post:** фото через упорядоченную связку PostImage.
- **Album:** фото через AlbumPhoto с порядком, обложка — первое фото.

**Фото.**
- При загрузке: `ImageOps.exif_transpose`, затем **удаляем EXIF** (там бывают GPS-координаты участников), нарезаем WebP 1600 и 760.
- Оригинал не храним.
- Лимит 25 МБ, принимаем только изображения.
- Файлы лежат в `MEDIA_ROOT`, отдаёт их Caddy.

**API `/api/v1/`** строго по `docs/api-contract.md`. Ключи отдаём в camelCase через явные `source=` в сериализаторах — без лишней зависимости.
- Чтение публичное, только опубликованное. Кураторы видят и черновики.
- **`scope=upcoming|archive`** считаем по дате сервера в московском часовом поясе: архив — это `is_archived` или `end_date < today`.
- **Фильтры:** `search`, `category` (несколько через запятую), `difficulty`, `ordering`; пагинация DRF.
- **Запись:** сессия и CSRF.
  - `GET /auth/csrf/` выдаёт cookie;
  - `POST /auth/login/`, `POST /auth/logout/`, `GET /auth/me/`;
  - CRUD для events, posts и albums;
  - `POST /photos/` (multipart).
- **Права:** «Организатор» — всё; «Активист» — только записи со своим `author`. Проверяются на сервере (object permissions DRF).
- **Безопасность:** django-axes от перебора паролей, throttling. Текст храним абзацами без HTML, React его экранирует, поэтому nh3 не нужен.

**Сброс кэша фронта.** На `post_save`/`post_delete` Event, Post и Album шлём `POST REVALIDATE_URL` с секретом и тегами. В dev без URL это no-op.

**Админка — служебная.**
- тема django-unfold;
- все модели, действие «В архив»;
- пользователи и группы «Организатор» и «Активист» создаются миграцией.

**Сид.**
- Node-скрипт `scripts/export-mocks.mjs` выгружает моки фронта (`src/mocks/*.ts`) в JSON.
- Команда `manage.py seed_demo` загружает их и копирует фото из `pilgrim_front/public/images/photos` в media.
- В итоге в dev-базе тот же контент, что в демо.

**Тесты (pytest):**
- форма ответов совпадает с контрактом — ключи и типы по `types.ts`;
- фильтры и `scope`;
- права ролей на запись и удаление;
- черновики скрыты от анонима;
- загрузка фото: размеры, WebP, EXIF удалён;
- сброс кэша вызывается при сохранении (замоканный HTTP).

## Фронт — два режима (S3)

- **`next.config.ts`:**
  - `output: 'export'` только при `STATIC_EXPORT=1` (демо на Pages), иначе `standalone`;
  - в боевом режиме `rewrites` `/api/*` → Django для локальной разработки, чтобы фронт и API были на одном origin и работали cookie.
- **`shared/api/*`:** при заданном `API_URL` функции `getEvents`/`getEvent`/`getPosts`/… ходят в Django через `fetch` с `next: { revalidate: 60, tags }`. Иначе остаются моки. Сигнатуры не меняются.
- **Динамические роуты:**
  - в боевом режиме `dynamicParams = true`, новые записи открываются по обычным адресам `/events/<slug>`;
  - `shared/api/routes.ts` в боевом режиме всегда отдаёт канонические адреса, `/…/view?slug=` нужен только демо.
- **Эндпойнт сброса кэша** `app/api/revalidate/route.server.ts`. Расширение `server.ts` добавляется в `pageExtensions` только в боевом режиме, иначе статический экспорт упадёт на POST-роуте.
- **Редактор:**
  - `features/editor/model/content.ts` получает два адаптера с одним интерфейсом: IndexedDB для демо и API для боя;
  - `session.ts` в боевом режиме берёт пользователя из `/auth/me/`, а `/login` показывает форму логина и пароля вместо выбора роли;
  - формы и `PhotoUploader` не меняются: в боевом режиме фото уходят на `POST /photos/`, браузерная нарезка остаётся только в демо.
- **Workflow Pages** (`.github/workflows/deploy.yml`) получает `STATIC_EXPORT=1`, демо продолжает работать как сейчас.

## Инфраструктура в репозитории (S4, без сервера)

- **Dockerfile бэка:** python 3.13-slim, `uv sync --frozen`, gunicorn с 2 воркерами.
- **Dockerfile фронта:** Next standalone, `node server.js`.
- **`docker-compose.yml`:** `caddy`, `next`, `django`, `postgres` (урезанные `shared_buffers`/`max_connections`), volumes для `media` и `pgdata`, лимиты логов.
- **`Caddyfile`:** `/api/*` и `/admin/*` → django, `/media/*` → файлы, остальное → next. Автоматический HTTPS по домену из env.
- **`.env.example`** со всеми переменными. Секреты в git не попадают.
- **`.github/workflows/backend.yml`:** ruff, `manage.py check --deploy`, `makemigrations --check`, pytest на сервисе PostgreSQL.
- **Сборка образов в GHCR** на push в `main`. Деплой по SSH — заготовка, включается после покупки сервера (B7, B8).

## Проверка

- **Бэк:**
  - `uv run ruff check`, `uv run pytest`;
  - `uv run python manage.py check` и `makemigrations --check`;
  - локально `seed_demo` и `runserver`, ручная проверка `/api/v1/events/?scope=upcoming` и админки.
- **Фронт в боевом режиме:** `API_URL=http://localhost:8000/api/v1 npm run dev`, затем Playwright-кликами:
  - главная, списки, календарь и галерея показывают данные из Django;
  - вход организатором, создание поста с фото, пост виден в ленте сразу после сохранения;
  - активист не может править чужое — и в интерфейсе, и в ответе API (403).
- **Фронт в демо-режиме:** `STATIC_EXPORT=1` сборка, затем проверка Pages, как раньше. Демо не должно сломаться.
- **CI:** зелёные `backend.yml` и `deploy.yml`.
- **Каждая сессия:** роадмап (чекбоксы и журнал), коммит и пуш в `main`.

## Риски

- **SQLite и PostgreSQL ведут себя по-разному** (поиск без учёта регистра по кириллице, JSON-поля). Ловим тестами в CI на PostgreSQL. Поиск делаем через `icontains` с нормализацией «ё».
- **Локально нет Docker** — compose и Caddy впервые запустятся только в CI (сборка образов) и на сервере. Их проверка вынесена в итерацию с сервером.
- **Отходы от ТЗ** (редактор на сайте, фото главного экрана) нужно подтвердить у заказчика. Django-админка остаётся, так что ТЗ формально выполнено.
