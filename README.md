# type-mapper

<a href="https://www.npmjs.com/package/type-mapperquery-pack">
    <img src="https://nodei.co/npm/type-mapper.png?mini=true">
</a>

TypeScript library for mapping objects and classes.

## Usage

Installation:

```js
npm i type-mapper
```

- [map() function](#map)
- [mapClasses() function](#mapclasses)
- [@mapProperty decorator](#mapproperty-decorator)

## map() function

Maps objects

```ts
import { map } from 'type-mapper';

...

const cat = {
    color: "gray",
    years: 2
}
const result = map(cat, ["color", value => value.toUpperCase()], ["years", value => value * 12,  "months"]);
console.info(result);
// {
//     color: "GRAY",
//     months: 24
// }
```

## mapClasses() function

Maps classes.

Destination class definition. Mapping options are described with [`@mapProperty` decorator](#mapproperty-decorator).

```ts
import { mapProperty } from 'type-mapper';

...

class CatClass {
    @mapProperty(value => value.toUpperCase())
    color: string;

    @mapProperty(value => value * 12, "years")
    months: number;
}

```

Mapping class object:

```ts
import { mapClass } from 'type-mapper';

...

const cat = {
    color: "gray",
    years: 2
}
const result = mapClass(cat, new CatClass());
console.info(result);
// {
//     color: "GRAY",
//     months: 24
// }
```

This is important to pass the classes object as a second parameter. In this way `mapClass` method reads decorators defined inside the class.

## @mapProperty() decorator

Describes how the property is to be mapped.

Parameter is an interface with properties:

| Name                     |  Type| Description|
| ------------------------ | ---- |------------ |
|source| `string`|Source property name|
|convert|`function` or `string`| In `function` case, parameter is source value the function result is definition value. In `string` case, possible values are: `number`, `string`, `default`.
 |
