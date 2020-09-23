import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';

interface ContextMenuPoint {
  x: number,
  y: number
}

export enum ContextMenuType {
  ACTION = 'action',
  SEPARATOR = 'separator',
}

export const ContextMenuSeparator: ContextMenuAction = {
  name: '',
  enabled: true,
  type: ContextMenuType.SEPARATOR
}

export interface ContextMenuAction {
  name: string,
  action?: Function,
  enabled?: boolean,
  type?: ContextMenuType,
  subActions?: ContextMenuAction[]
}

@Injectable()
export class ContextMenuService {
  /* Todo */
  static defaultParentViewContainerRef: ViewContainerRef;
  static ContextMenuComponentClass: { new(...args: any[]): any } = null;

  private panelComponentRef: ComponentRef<any>

  title: string = '';
  actions: ContextMenuAction[] = [];
  position: ContextMenuPoint = { x: 0, y: 0 };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  get isShow(): boolean {
    return this.panelComponentRef ? true : false;
  }

  open(position: ContextMenuPoint, actions: ContextMenuAction[], title?: string, parentViewContainerRef?: ViewContainerRef) {
    this.close();
    if (!parentViewContainerRef) {
      parentViewContainerRef = ContextMenuService.defaultParentViewContainerRef;
      console.log('Context Open');
    }
    let panelComponentRef: ComponentRef<any>;

    const injector = parentViewContainerRef.injector;
    const panelComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ContextMenuService.ContextMenuComponentClass);

    panelComponentRef = parentViewContainerRef.createComponent(panelComponentFactory, parentViewContainerRef.length, injector);

    const childPanelService: ContextMenuService = panelComponentRef.injector.get(ContextMenuService);

    childPanelService.panelComponentRef = panelComponentRef;
    if (actions) {
      let filteredActions = actions.filter(action => action.enabled != false);
      if (filteredActions.length && filteredActions[0].type == ContextMenuType.SEPARATOR) {
        filteredActions.shift();
      }
      let formattedActions = [];
      for (let i = 0, len = filteredActions.length; i < len -1; i++) {
        if (
          filteredActions[i].type != ContextMenuType.SEPARATOR ||
          filteredActions[i + 1].type != ContextMenuType.SEPARATOR
        ) {
          formattedActions.push(filteredActions[i]);
        }
      }
      if (filteredActions.length && filteredActions[filteredActions.length - 1].type != ContextMenuType.SEPARATOR) {
        formattedActions.push(filteredActions[filteredActions.length - 1]);
      }
      childPanelService.actions = formattedActions;
    }
    if (position) {
      childPanelService.position.x = position.x;
      childPanelService.position.y = position.y;
    }

    childPanelService.title = title != null ? title : '';

    panelComponentRef.onDestroy(() => {
      childPanelService.panelComponentRef = null;
    });
  }

  close() {
    if (this.panelComponentRef) {
      this.panelComponentRef.destroy();
      this.panelComponentRef = null;
    }
  }
}
