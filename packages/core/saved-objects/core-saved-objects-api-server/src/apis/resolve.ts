/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { SavedObjectsBaseOptions } from './base';
import type { SavedObject } from '../..';

/**
 * Options for the saved objects get operation
 *
 * @public
 */
export interface SavedObjectsResolveOptions extends SavedObjectsBaseOptions {
  /** {@link SavedObjectsRawDocParseOptions.migrationVersionCompatibility} */
  migrationVersionCompatibility?: 'compatible' | 'raw';
}

/**
 *
 * @public
 */
export interface SavedObjectsResolveResponse<T = unknown> {
  /**
   * The saved object that was found.
   */
  saved_object: SavedObject<T>;
  /**
   * The outcome for a successful `resolve` call is one of the following values:
   *
   *  * `'exactMatch'` -- One document exactly matched the given ID.
   *  * `'aliasMatch'` -- One document with a legacy URL alias matched the given ID; in this case the `saved_object.id` field is different
   *    than the given ID.
   *  * `'conflict'` -- Two documents matched the given ID, one was an exact match and another with a legacy URL alias; in this case the
   *    `saved_object` object is the exact match, and the `saved_object.id` field is the same as the given ID.
   */
  outcome: 'exactMatch' | 'aliasMatch' | 'conflict';
  /**
   * The ID of the object that the legacy URL alias points to.
   *
   * **Note:** this field is *only* included when an alias was found (in other words, when the outcome is `'aliasMatch'` or `'conflict'`).
   */
  alias_target_id?: string;
  /**
   * The reason this alias was created.
   *
   * Currently this is used to determine whether or not a toast should be shown when a user is redirected from a legacy URL; if the alias
   * was created because of saved object conversion, then we will display a toast telling the user that the object has a new URL.
   *
   * **Note:** this field is *only* included when an alias was found (in other words, when the outcome is `'aliasMatch'` or `'conflict'`).
   */
  alias_purpose?: 'savedObjectConversion' | 'savedObjectImport';
}
