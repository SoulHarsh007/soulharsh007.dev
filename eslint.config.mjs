import {FlatCompat} from '@eslint/eslintrc';
import perfectionist from 'eslint-plugin-perfectionist';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  perfectionist.configs['recommended-natural'],
];

export default eslintConfig;
