# Design Tokens

All tokens are CSS custom properties defined in `styles.css`.
Values scale across four breakpoints: mobile (default), tablet (768px), desktop (1024px), large desktop (1900px).

---

## Color

| Token              | Value     |
|--------------------|-----------|
| `--color-black`    | `#4f4f4f` |
| `--color-gray`     | `#6b6b6b` |
| `--color-blue`     | `#2b5cd9` |
| `--color-placeholder` | `#2b5cd9` |
| `--color-white`    | `#ffffff` |

## Typography — Fonts

| Token         | Value                                          |
|---------------|------------------------------------------------|
| `--font-serif` | `"Noto Serif JP", Georgia, "Times New Roman", serif` |
| `--font-sans`  | `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif` |

## Typography — Scale

Weight and letter-spacing are fixed across breakpoints. Size and line-height scale.

### Display

| Property         | Mobile    | Desktop   | Large     |
|------------------|-----------|-----------|-----------|
| `--font-size`    | 1.75rem (28px) | 3.5rem (48px) | 4.5rem (64px) |
| `--line-height`  | 2.75rem (44px) | 4.5rem (72px) | 6rem (96px) |
| `--font-weight`  | 500       | —         | —         |
| `--letter-spacing` | -1px    | —         | —         |

### Heading

| Property         | Mobile    | Desktop   | Large     |
|------------------|-----------|-----------|-----------|
| `--font-size`    | 1.5rem (24px) | 1.75rem (28px) | 2.25rem (36px) |
| `--line-height`  | 2rem (32px) | 2.75rem (44px) | 3.5rem (56px) |
| `--font-weight`  | 500       | —         | —         |
| `--letter-spacing` | -1px    | —         | —         |

### Body Large

| Property         | Mobile    | Desktop   | Large     |
|------------------|-----------|-----------|-----------|
| `--font-size`    | 1.25rem (20px) | 2.25rem (36px) | 3rem (48px) |
| `--line-height`  | 2rem (32px) | 3.25rem (52px) | 4.5rem (72px) |
| `--font-weight`  | 400       | —         | —         |
| `--letter-spacing` | -1.2px  | —         | —         |

### Body

| Property         | Mobile    | Desktop   | Large     |
|------------------|-----------|-----------|-----------|
| `--font-size`    | 1rem (16px) | 1.5rem (24px) | 2rem (32px) |
| `--line-height`  | 1.5rem (24px) | 2.25rem (36px) | 3rem (48px) |
| `--font-weight`  | 500       | —         | —         |
| `--letter-spacing` | 0px     | —         | —         |

### Caption

| Property         | Mobile    | Desktop   | Large     |
|------------------|-----------|-----------|-----------|
| `--font-size`    | 0.875rem (14px) | 1.125rem (18px) | 1.5rem (24px) |
| `--line-height`  | 1.625rem (26px) | 1.625rem (26px) | 2.25rem (36px) |
| `--font-weight`  | 400       | —         | —         |
| `--letter-spacing` | 0px     | —         | —         |

## Spacing

| Token          | Mobile  | Desktop | Large   |
|----------------|---------|---------|---------|
| `--space-s`    | 1rem    | —       | —       |
| `--space-m`    | 2rem    | —       | —       |
| `--space-l`    | 4rem    | —       | —       |
| `--space-xl`   | 6rem    | 8rem    | 10rem   |

## Layout

| Token            | Mobile    | Tablet  | Desktop | Large   |
|------------------|-----------|---------|---------|---------|
| `--page-padding` | 1.25rem   | 2.5rem  | 0.5rem  | 5rem    |
| `--border-radius` | 16px     | —       | —       | —       |

## Where tokens are used

- `--page-padding` — horizontal margin for all page content (nav, hero, projects, content blocks, footer)
- `--space-xl` — hero top padding, project card vertical spacing, content block vertical padding
- `--space-l` — hero bottom padding, project row gap (desktop), about page gap, footer top padding
- `--space-m` — project title top margin, about headline bottom margin, project header title bottom margin
- `--space-s` — nav vertical padding, content label bottom margin, content paragraph top margin
- `--border-radius` — all image containers (project cards, full-width images, about image)
