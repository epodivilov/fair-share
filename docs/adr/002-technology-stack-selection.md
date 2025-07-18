# 002. Technology Stack Selection

- **Статус:** Принято
- **Дата:** 2025-07-16

## Context

Для разработки MVP мы выбираем технологический стек, который будет удовлетворять требованиям NFRs и быть достаточно простым для поддержки.

## Decision

Мы выбираем следующие технологии:

- Backend: (Node.js)[https://nodejs.org/], (Hono)[https://hono.dev/].
- Frontend: (Svelte)[https://svelte.dev/], (Vite)[https://vite.dev/].
- Database: (PostgreSQL)[https://www.postgresql.org/], (Kysely)[https://kysely.dev/].
- CI/CD: (GitHub Actions)[https://github.com/features/actions], (Docker)[https://www.docker.com/].
- Auth: (Google OAuth 2.0)[https://developers.google.com/identity/sign-in/web/sign-in].

## Consequences

**Positive:**

- PostgreSQL - реляционная база данных, позволяет хранить структурированные данные и связи между ними, поддерживает транзакции.
- Kysely - query builder для PostgreSQL. Typesafe, auto-completion, но при этом мы всё ещё можем использовать SQL.
- Hono - мультиплатформенный фреймворк для разработки бекенда, с возможностью разрабатывать не только REST. Лёгкий и быстрый. Совместим с Web стандартами.
- Svelte - быстрый и лёгкий фреймворк для разработки фронтенда. Легче чем React, поддерживает Web стандарты. Комьюнити больше нацелено на эффективную разработку.
- GitHub Actions - стандартный инструмент для CI/CD. Бесплатный.
- Docker - стандартный инструмент для контейнеризации. Бесплатный.
- Google OAuth 2.0 - простой и надёжный способ аутентификации. Удобен для большинства пользователей. Бесплатен.

**Negative:**

- PostgreSQL - хуже работает с неструктурированными данными. Требует использования точных типов данных.
- Kysely - не полноценный ORM, а query builder.
- Hono - не столь популярный фреймворк, как например Express. Меньше экосистема и комьюнити.
- Svelte - не столь популярный фреймворк, как например React. Меньше экосистема и комьюнити.
- GitHub Actions - привязка к GitHub.
- Google OAuth 2.0 - нет возможности использовать другие способы аутентификации.

**Compromise:**

Учитывая NFRs нашего MVP мы выбираем простые и надёжные инструменты.

Выбираем для разработки Hono, так как этот фреймворк небольшой и простой в использовании. У него не такая большая и обширная экосистема, однако для нашего MVP есть всё необходимое. У него отличная документация и достаточно различных плагинов. На нём можно собрать как стандартный REST, так и более сложные RPC-интерфейсы. Кроме того он работает не только в Node.js, что может быть полезно в будущем если решим разворачивать наш бекенд не в Docker.

Выбираем голый Svelte чтобы не усложнять проект. Для нашего MVP нет необходимости в SSR и сложном роутинге. Кроме того, Svelte можно просто разместить на CDN, а не разворачивать в отдельном образе. А мигрировать проект на SvelteKit в будущем будет не сложно. Мы сознательно не берём React за его медлительность, размеры и слишком разношёрстную экосистему.

Выбираем PostgreSQL, так как это бесплатная и надёжная реляционная база данных. Исходя из характера наших данных нам подходит именно реляционная база, поскольку она сохраняет связи между данными. Так же она поддерживает транзакции, что позволяет нам избежать ошибок при обновлении большого количества полей и таблиц.

Мы не будем использовать ORM, чтобы сократить количество сторонних зависимостей и магии в коде. Но мы будем использовать Kysely, чтобы иметь type-проверки и auto-completion.

Выбираем GitHub Actions, так как код проекта хранится на GitHub. Кроме того, GitHub Actions бесплатен.

Выбираем Docker, так как это один из самых популярных контейнеризаторов и можно найти сервисы которые будут бесплатно разворачивать наш бекенд.

Выбираем Google OAuth 2.0, так как это один из самых популярных способов аутентификации. Исходя из требований мы не хотим на первых этапах заниматься проблемами безопасности и хранения паролей пользователей. Для реализации MVP будет достаточно только авторизации через Google.
