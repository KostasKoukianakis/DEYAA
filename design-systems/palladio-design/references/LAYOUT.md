# Layout Reference

> Auto-extracted from live DOM. Use this to understand how the site is structured spatially.

## Spacing System

**Base grid:** 10px

**Scale:** `10, 20, 40, 60, 100` px

| Spacing | Semantic Use |
|---------|-------------|
| 10px | Tight — within a component |
| 20px | Medium — between sibling items |
| 40px | Wide — between sections |
| 80px | Vast — major section breaks |

## Structural Containers

### `<section>` (`section.error.content`)

```
display:          block
children:         2
```

## Layout Rules

- Every spacing value must be a multiple of **10px**
- Never use arbitrary margin/padding values outside the spacing scale

