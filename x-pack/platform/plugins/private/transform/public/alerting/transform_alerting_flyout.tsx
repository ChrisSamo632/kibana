/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { RuleFormFlyout } from '@kbn/response-ops-rule-form/flyout';
import { memoize } from 'lodash';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { pluck } from 'rxjs';
import useObservable from 'react-use/lib/useObservable';
import { useAppDependencies } from '../app/app_dependencies';
import type {
  TransformHealthAlertRule,
  TransformHealthRuleParams,
} from '../../common/types/alerting';
import { TRANSFORM_RULE_TYPE } from '../../common';

interface TransformAlertFlyoutProps {
  initialAlert?: TransformHealthAlertRule | null;
  ruleParams?: TransformHealthRuleParams | null;
  onSave?: () => void;
  onCloseFlyout: () => void;
}

export const TransformAlertFlyout: FC<TransformAlertFlyoutProps> = ({
  initialAlert,
  ruleParams,
  onCloseFlyout,
  onSave,
}) => {
  const { triggersActionsUi, ...plugins } = useAppDependencies();

  const AlertFlyout = useMemo(() => {
    if (!triggersActionsUi) return;

    const { ruleTypeRegistry, actionTypeRegistry } = triggersActionsUi;

    const commonProps = {
      plugins: { ...plugins, ruleTypeRegistry, actionTypeRegistry },
      onCancel: () => {
        onCloseFlyout();
      },
      onSubmit: async () => {
        if (onSave) {
          onSave();
        }
        onCloseFlyout();
      },
    };

    if (initialAlert) {
      return <RuleFormFlyout {...commonProps} id={initialAlert.id} />;
    }

    return (
      <RuleFormFlyout
        {...commonProps}
        consumer={'stackAlerts'}
        ruleTypeId={TRANSFORM_RULE_TYPE.TRANSFORM_HEALTH}
        initialMetadata={{}}
        initialValues={{
          params: ruleParams!,
        }}
      />
    );
    // deps on id to avoid re-rendering on auto-refresh
  }, [triggersActionsUi, plugins, initialAlert, ruleParams, onCloseFlyout, onSave]);

  return <>{AlertFlyout}</>;
};

interface AlertRulesManage {
  editAlertRule$: Observable<TransformHealthAlertRule | null>;
  createAlertRule$: Observable<TransformHealthRuleParams | null>;
  setEditAlertRule: (alertRule: TransformHealthAlertRule) => void;
  setCreateAlertRule: (transformId: string) => void;
  hideAlertFlyout: () => void;
}

export const getAlertRuleManageContext = memoize(function (): AlertRulesManage {
  const ruleState$ = new BehaviorSubject<{
    editAlertRule: null | TransformHealthAlertRule;
    createAlertRule: null | TransformHealthRuleParams;
  }>({
    editAlertRule: null,
    createAlertRule: null,
  });
  return {
    editAlertRule$: ruleState$.pipe(pluck('editAlertRule')),
    createAlertRule$: ruleState$.pipe(pluck('createAlertRule')),
    setEditAlertRule: (initialRule) => {
      ruleState$.next({
        createAlertRule: null,
        editAlertRule: initialRule,
      });
    },
    setCreateAlertRule: (transformId: string) => {
      ruleState$.next({
        createAlertRule: { includeTransforms: [transformId] },
        editAlertRule: null,
      });
    },
    hideAlertFlyout: () => {
      ruleState$.next({
        createAlertRule: null,
        editAlertRule: null,
      });
    },
  };
});

export const AlertRulesManageContext = createContext<AlertRulesManage>(getAlertRuleManageContext());

export function useAlertRuleFlyout(): AlertRulesManage {
  return useContext(AlertRulesManageContext);
}

export const TransformAlertFlyoutWrapper = () => {
  const { editAlertRule$, createAlertRule$, hideAlertFlyout } = useAlertRuleFlyout();
  const editAlertRule = useObservable(editAlertRule$);
  const createAlertRule = useObservable(createAlertRule$);

  return editAlertRule || createAlertRule ? (
    <TransformAlertFlyout
      initialAlert={editAlertRule}
      ruleParams={createAlertRule!}
      onCloseFlyout={hideAlertFlyout}
    />
  ) : null;
};
