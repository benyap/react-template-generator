# Example configuration

This example has four Typescript generators, and uses a `module` substructure. When used, it could create a project structure like this:

```
.
├── src/
│   └── modules/
│       ├── core/
│       │   ├── components/
│       │   │   ├── MyCoreComponent/...
│       │   │   └── AnotherComponent/...
│       │   └── containers/
│       │       └── MyCoreContainer/...
│       ├── admin/
│       │   ├── components/
│       │   │   ├── MyAdminComponent/...
│       │   │   └── AnotherAdminComponent/...
│       │   └── pages/
│       │       ├── AdminHomePage/...
│       │       └── AdminSettingsPage/...
│       └── anotherModule/...
├── templates/...
├── reactgenconfig.json
└── README.md

```

Feel free to check out the source code and copy and modify this for your own projects as you need.

### Component

Run with this command:

```
yarn reactgen component
```

Scaffolds these files for a React component:

- `index.ts`
- `{{ properCase name }}.tsx`
- `types.d.ts`
- `styles.ts`

### Container

Run with this command:

```
yarn reactgen container
```

Scaffolds these files for a React container component:

- `index.ts`
- `{{ properCase name }}.tsx`
- `types.d.ts`

### Context

Run with this command:

```
yarn reactgen context
```

Scaffolds these files for a React context and context provider:

- `index.ts`
- `{{ properCase name }}Provider.tsx`
- `types.d.ts`

### Page

Run with this command:

```
yarn reactgen page
```

Scaffolds these files for a plain React compnonent to be used as a page:

- `index.ts`
- `{{ properCase name }}Page.tsx`
- `styles.ts`
