# Configure your generators

To configure `react-template-generator`, create a file called `reactgenconfig.json` in your project root. Note that the location of your configuration file will be treated as the root path.

---

## Root options

_Defaults are used if these values are not present in the configuration file._

**basePath**

A relative path (from the project root) to the location where components should be generated.

_Default: `src`_

**templatePath**

A relative path (from the project root) to the location where template files are located.

_Default: `templates`_

---

## Generator options

To create a generator, create an object with the following properties inside the `parts` key in the top-level object, with the key as the name of the generator.

**description**

A description for the part being generated.

**variables[]**

Configure the values to get from the user in order to generate the part.
This should be an array of objects with the following keys:

**variables.\$.name**

A unique name for the variable being requested. This value can be used as a substitution token when generating components using [Handlebars](https://handlebarsjs.com/guide/) syntax.

**variables.\$.message**

The message used to prompt the user for input.

**variables.\$.defaultValue**

A default value for this variable.

**variables.\$.optional**

Make this variable optional. By default, all variables are required.

**variables.\$.test**

If a regular expression is provided, it will be used to check the value of the variable. The value should be an object with the following keys:

**variables.\$.test.regex**

The regular expression to use to check.

**variables.\$.test.error**

The error message if the regular expression fails.

**variables.\$.test.inverted**

Invert the regex result. By default, an error is thrown if the regex contains a match.

**templates[]**

Configure the template files to generate for this part.
This should be an array of objects with the following keys:

**templates.\$.path**

A relative path (from `basePath`) to the location where this template file should be generated. [Handlebars](https://handlebarsjs.com/guide/) substitution tokens may be used.

**templates.\$.templateFile**

A relative path (from `templatePath`) to the location of the template file.

**templates.\$.continueOnFail**
Continue the generation process even if this template fails to generate successfully. By default, the process will abort on failure.

---

## Example configuration

```json
{
  "basePath": "src",
  "templatePath": "templates",
  "parts": {
    "component": {
      "description": "Create a component",
      "variables": [
        {
          "name": "name",
          "message": "What should the component be called?"
        }
      ],
      "templates": [
        {
          "path": "components/{{ properCase name }}/index.ts",
          "templateFile": "component/index.ts.hbs"
        },
        {
          "path": "{{ module }}/components/{{ properCase name }}/{{ properCase name }}.tsx",
          "templateFile": "component/component.tsx.hbs"
        },
        {
          "path": "{{ module }}/components/{{ properCase name }}/types.d.ts",
          "templateFile": "component/types.d.ts.hbs"
        }
      ]
    },

    "page": {
      "description": "Create a page",
      "variables": [
        {
          "name": "name",
          "message": "What should the context be called? ('Page' will be appended to the name)",
          "test": {
            "regex": "Page",
            "error": "Do not use \"Page\" in the name."
          }
        }
      ],
      "templates": [
        {
          "path": "{{ module }}/pages/{{ properCase name }}Page/index.ts",
          "templateFile": "page/index.ts.hbs"
        },
        {
          "path": "{{ module }}/pages/{{ properCase name }}Page/{{ properCase name }}Page.tsx",
          "templateFile": "page/page.tsx.hbs"
        }
      ]
    }
  }
}
```
