<h1 align="center">
  <b>THIS PROJECT IS ARCHIVED</b>
</h1>
<p align="center">
  Please check out <a href="http://www.hygen.io">Hygen</a> for a good alternative!
</p>

---

# React Template Generator

**Don't work harder, work smarter.**

A simple CLI tool used to help scaffold React components from custom templates for your project = efficiency and consistency.

## Quickstart

1. Use Node 10.

2. Install the package:

```
yarn add -D @benyap/react-template-generator
```

3. Create a configuration file in your project root called `reactgenconfig.json`. [Learn how to configure it](docs/Config.md).

4. Create your templates in your project root in a folder called `templates`. [Learn how to create templates](docs/Template.md).

5. Run a simple command\* to generate your component.

```
yarn reactgen <name>
```

\* If using `npm`, as this to your `package.json`:

```json
{
  "scripts": {
    "reactgen": "reactgen"
  }
}
```

and use `npm run reactgen <name>` to generate your component.

## Examples

See an example configuration [here](example/). Treat the `example` folder as the project root.

## Why Generators?

_From [Plop](https://plopjs.com/documentation/#why-generators-):_

> Because when you create your boilerplate separate from your code, you naturally put more time and thought into it.
>
> Because saving your team (or yourself) 5-15 minutes when creating every route, component, controller, helper, test, view, etc... [really adds up](https://xkcd.com/1205/).
>
> Because [context switching is expensive](https://www.petrikainulainen.net/software-development/processes/the-cost-of-context-switching/) and saving time is not the only benefit to automating workflows.

## License

[MIT](LICENSE)
