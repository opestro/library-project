# CSS Architecture Guide for Library Project

## Overview

This document outlines the CSS architecture for the Library Project, which follows an iOS-style design system. The architecture leverages Tailwind CSS with custom CSS variables for a consistent design language.

## Key Components

### 1. CSS Variables

All design tokens are defined as CSS variables in `src/app/globals.css`. These variables include:

- **Colors**: iOS color palette, grayscale, and theme colors
- **Spacing and sizing**: Border radius, padding, margin
- **Transitions**: Animation durations and timing functions
- **Typography**: Font sizes, weights, line heights
- **Effects**: Shadows, blurs

```css
:root {
  /* iOS color palette */
  --ios-blue: #007AFF;
  --ios-green: #34C759;
  /* ... other colors ... */
  
  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  /* ... other radii ... */
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Tailwind Integration

Our CSS variables are integrated with Tailwind via `tailwind.config.ts`, making them available as utility classes:

```js
theme: {
  extend: {
    colors: {
      ios: {
        blue: 'var(--ios-blue)',
        green: 'var(--ios-green)',
        // ...
      },
      // ...
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      // ...
    },
  }
}
```

This allows us to use them in Tailwind classes:

```jsx
<button className="bg-ios-blue text-white rounded-md">
  Click me
</button>
```

### 3. Component Classes

Common component patterns are defined using `@layer components` in the CSS file:

```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-full font-medium;
    /* ... */
  }
  
  .card {
    @apply bg-theme-background rounded-lg p-6;
    /* ... */
  }
}
```

## Best Practices

### Using CSS Variables

Always prefer CSS variables over hardcoded values for:

1. **Colors**: `var(--ios-blue)` instead of `#007AFF`
2. **Border radius**: `var(--radius-md)` instead of `12px`
3. **Transitions**: `var(--transition-base)` instead of `250ms`

### Using Tailwind Classes

1. Use the Tailwind utilities that reference our CSS variables:
   ```jsx
   // Preferred
   <div className="bg-ios-blue rounded-md" />
   
   // Avoid
   <div className="bg-[#007AFF] rounded-[12px]" />
   ```

2. Use the `cn()` utility to conditionally combine classes:
   ```jsx
   cn(
     'base-class',
     variant === 'primary' && 'bg-ios-blue',
     variant === 'secondary' && 'bg-gray-50'
   )
   ```

### Component Styling

1. **UI Components**: For reusable UI components like Button, Card, etc., use the property-based approach where styling is determined by props:

   ```jsx
   <Button variant="primary" size="md">
     Click me
   </Button>
   ```

2. **Layout Components**: For layout components, use semantic classes:

   ```jsx
   <section className="py-16 bg-gray-50">
     <div className="container mx-auto">
       {/* content */}
     </div>
   </section>
   ```

3. **Theme Consistency**: Use the theme-specific variables for contextual styling:

   ```jsx
   <p className="text-theme-text-secondary">
     Secondary text that adapts to dark/light mode
   </p>
   ```

### Dark Mode

Dark mode is handled automatically through CSS variables and Tailwind's dark mode feature:

```jsx
<div className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
  Content that adapts to dark mode
</div>
```

## Directory Structure

- `src/app/globals.css`: Main CSS file with variables and component styles
- `src/components/ui/`: Contains all reusable UI components
- `tailwind.config.ts`: Tailwind configuration that integrates CSS variables

## Maintaining Consistency

1. Always use the design system components when available
2. Add new colors to the CSS variables rather than using inline colors
3. Document any new CSS patterns added to the system
4. Run style linting before committing changes
5. Review UI changes against the iOS design guidelines

By following these guidelines, we ensure a consistent, maintainable, and beautiful UI throughout the application. 