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

- [Options](#options)
- [Philosophy](#philosophy)
- [Base](#base)
- [Primitive Strategies](#primitive-strategies)
- [Complex Strategies](#complex-strategies)

## map()

Maps objects

```ts
import { map } from 'type-mapper';

...

const cat = {
    color: "gray",
    years: 2
}
const result = map(cat, ["color", value=>value.toUpperCase()], ["years", value=> value * 12,  "months"]);
console.info(result);
// {
//     color: "GRAY",
//     months: 24
// }
```

## mapClasses() 

Maps classes.

Parameter is an interface with properties:

| Name                     |  Type| Description|
| ------------------------ | ------------------------ |--------- |
|source| `string`||
|type|`string`||
|convert|`function`||

Destination class definition. Mapping options are described with `@mapProperty` decorator.

```ts
import { mapProperty } from 'type-mapper';

...

class CatClass {
    @mapProperty(value=>value.toUpperCase())
    color: string;

    @mapProperty(value=> value * 12, "months")
    years: number;
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


