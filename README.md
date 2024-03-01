# flex-mapper

<a href="https://www.npmjs.com/package/flex-mapperquery-pack">
    <img src="https://nodei.co/npm/flex-mapper.png?mini=true">
</a>

TypeScript library for mapping objects and classes.

## Usage

Installation:

```js
npm i flex-mapper
```

- [map() function](#map)
- [mapClasses() function](#mapclasses)
- [@mapProperty decorator](#mapproperty-decorator)
- [@mapConvert decorator](#mapconvert-decorator)

## map() function

Maps objects

```ts
import { map } from 'flex-mapper';

...

const cat = {
    name: "Tom",
    color: "gray",
    years: 2
}
const result = map(cat, {
    name: 'nickname',
    color: value => value.toUpperCase(),
    years: [value => value * 12, "months"]
});
console.info(result);
// {
//     nickname: "Tom",
//     color: "GRAY",
//     months: 24
// }
```

## mapClasses() function

Maps classes.

Destination class definition. Mapping options are described with decorators: [`@mapProperty`](#mapproperty-decorator) and [`@mapConvert`](#mapconvert-decorator).

```ts
import { mapProperty, mapConvert } from 'flex-mapper';

...

class CatClass {
    @mapProperty("name")
    nickname: number;

    @mapConvert(value => value.toUpperCase())
    color: string;

    @mapProperty("years", value => value * 12)
    months: number;
}

```

Mapping class object:

```ts
import { mapClass } from 'flex-mapper';

...

const cat = {
    name: "Tom",
    color: "gray",
    years: 2
}
const result = mapClass(cat, new CatClass());
console.info(result);
// {
//     nickname: "Tom",
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
|convert|`function` or `string`| In `function` case, parameter is source value the function result is definition value. In `string` case, possible values are: `number`, `string`.
 |

## @mapConvert() decorator

Has one `function` or `string` parameter for converting.
