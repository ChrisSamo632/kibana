/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';

interface BaseObjectType {
  id: string;
}

export class TypeRegistry<T extends BaseObjectType> {
  private readonly objectTypes: Map<string, T> = new Map();

  /**
   * Returns if the object type registry has the given type registered
   */
  public has(id: string) {
    return this.objectTypes.has(id);
  }

  /**
   * Registers an object type to the type registry
   */
  public register(objectType: T) {
    if (this.has(objectType.id)) {
      throw new Error(
        i18n.translate('alertsUIShared.typeRegistry.register.duplicateObjectTypeErrorMessage', {
          defaultMessage: 'Object type "{id}" is already registered.',
          values: {
            id: objectType.id,
          },
        })
      );
    }
    this.objectTypes.set(objectType.id, objectType);
  }

  /**
   * Returns an object type, throw error if not registered
   */
  public get(id: string): T {
    if (!this.has(id)) {
      throw new Error(
        i18n.translate('alertsUIShared.typeRegistry.get.missingActionTypeErrorMessage', {
          defaultMessage: 'Object type "{id}" is not registered.',
          values: {
            id,
          },
        })
      );
    }
    return this.objectTypes.get(id)!;
  }

  public list() {
    return Array.from(this.objectTypes).map(([id, objectType]) => objectType);
  }
}
