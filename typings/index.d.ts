/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

declare module 'axios/lib/adapters/xhr';

// Storybook references this module. It's @ts-ignored in the codebase but when
// built into its dist it strips that out. Add it here to avoid a type checking
// error.
//
// See https://github.com/storybookjs/storybook/issues/11684
declare module 'react-syntax-highlighter/dist/cjs/create-element';
declare module 'react-syntax-highlighter/dist/cjs/prism-light';

declare module 'find-cypress-specs';
declare module '@cypress/grep/src/plugin';
