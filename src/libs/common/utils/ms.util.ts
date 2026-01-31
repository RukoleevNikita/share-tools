// переписать реализиацию функции ms в файле src/libs/common/utils/ms.util.ts
// export function ms(str: string): number {
//   const matches = str.match(/^(\d+)(ms|s|m|h|d|w)$/);
//   if (!matches) {
//     throw new Error(`Invalid time string: ${str}`);
//   }
//   const value = parseInt(matches[1], 10);
//   const unit = matches[2];
//   switch (unit) {
//     case 'ms':
//       return value;
//     case 's':
//       return value * 1000;
//     case 'm':
//       return value * 60 * 1000;
//     case 'h':
//       return value * 60 * 60 * 1000;
//     case 'd':
//       return value * 24 * 60 * 60 * 1000;
//     case 'w':
//       return value * 7 * 24 * 60 * 60 * 1000;
//     default:
//       throw new Error(`Invalid time unit: ${unit}`);
//   }
// }
