/**
 * Types for the vendored TextProv decoder (textprov.js). Hand-written: the
 * upstream package ships no declarations.
 */
export type ProvenanceState = 'human' | 'ai';

export interface ProvenanceRun {
  /** `null` for unmarked text (the proposal's Voice0). */
  state: ProvenanceState | null;
  text: string;
}

export interface TextprovOptions {
  strip?: boolean;
  merge_whitespace?: boolean;
  mergeWhitespace?: boolean;
  prefix?: string;
  display?: 'passage' | 'exact';
}

declare const textprov: {
  runs: (text: string, opts?: TextprovOptions) => ProvenanceRun[];
  render: (root?: Element | Document, opts?: TextprovOptions) => number;
  setDisplay: (root: Element | Document | null | undefined, display: 'passage' | 'exact') => void;
  segments: (text: string) => string[];
  specVersion: string;
  unicodeVersion: string;
  registryVersion: string;
  displayVersion: string;
  displayFamily: string;
  mapping: {
    version: string;
    selectors: Record<ProvenanceState, number>;
    puaRanges: Array<[number, number]>;
  };
};

export default textprov;
