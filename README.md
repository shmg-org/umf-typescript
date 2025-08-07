# UMF TypeScript Parser

The TypeScript Implementation of the [Universal Media Format](https://github.com/shmg-org/umf-specification).

## Example

```typescript
import { parse } from '@shmg/umf'

const source = `UMF TypeScript Parser

[ Github ]
Author: IceBrick
Language: TypeScript`

const metadata = parse(source)

console.log(metadata.get('Github', 'Author'))
```

## Installation

The package is available on [npm](https://www.npmjs.com/package/@shmg/umf). You can install it using npm or your desired package manager:

```bash
npm install @shmg/umf
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
