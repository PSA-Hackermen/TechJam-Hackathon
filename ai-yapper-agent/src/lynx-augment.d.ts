// src/lynx-augment.d.ts
import * as Lynx from '@lynx-js/types';

declare module '@lynx-js/types' {
  interface IntrinsicElements extends Lynx.IntrinsicElements {
    input: {
      type: string; // "text" | "password" | "number" | ...
      value?: string;
      placeholder?: string;
      // Lynx-style event naming, like your bindtap
      bindinput?: (e: { type: 'input'; detail: { value: string } }) => void;
    };
    textarea?: {
      value?: string;
      placeholder?: string;
      rows?: number | string;
      bindinput?: (e: { type: 'input'; detail: { value: string } }) => void;
    };
    'scroll-view'?: {
      id?: string;
      'scroll-orientation'?: string;
      'scroll-bar-enable'?: boolean;
      style?: React.CSSProperties;
      bindcontentsizechanged?: (e: {
        type: 'contentsizechanged';
        detail: {
          type: 'contentsizechanged';
          scrollWidth: number;
          scrollHeight: number;
        };
      }) => void;
      bindscroll?: (e: {
        type: 'scroll';
        detail: {
          type: 'scroll';
          deltaX: number;
          deltaY: number;
          scrollLeft: number;
          scrollTop: number;
          scrollHeight: number;
          scrollWidth: number;
        };
      }) => void;
    };
  }
}

// Declare global lynx object
declare global {
  interface LynxSelectorQuery {
    select(selector: string): LynxSelectorQuery;
    setNativeProps(props: Record<string, unknown>): LynxSelectorQuery;
    invoke(options: {
      method: string;
      params?: Record<string, any>;
      success?: (res: any) => void;
      fail?: (res: any) => void;
    }): LynxSelectorQuery;
    exec(): void;
  }

  interface LynxGlobal {
    createSelectorQuery(): LynxSelectorQuery;
    switchKeyBoardDetect?: (enabled: boolean) => void;
  }

  var lynx: LynxGlobal | undefined;
}
