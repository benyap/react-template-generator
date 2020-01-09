# Creating templates for your generator

Create templates using [Handlebars syntax](https://handlebarsjs.com/guide/). Variables that have been requested through the `variables` configuration for your generator will be available inside your template.

Place your template files inside a `templates` folder in your project root. Alternatively, configure the location of your templates using `reactgenconfig.json`.

Here is an example of a template:

```hbs
import React, { FC } from 'react';

import { {{ properCase name }}Props } from './types';
import useStyles from './styles';

/**
 * TODO: Add description
 */
export const {{ properCase name }}: FC<{{ properCase name }}Props> = () => {
  return null;
}
```

This file, when generated, will produce a source file that looks something like this:

```ts
import React, { FC } from "react";

import { MyComponentProps } from "./types";
import useStyles from "./styles";

/**
 * TODO: Add description
 */
export const MyComponent: FC<MyComponentProps> = () => {
  return null;
};
```
