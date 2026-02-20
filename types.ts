import React from 'react';

export enum AppState {
  UPLOAD = 'UPLOAD',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW',
  ERROR = 'ERROR'
}

export interface GenerationResult {
  code: string;
  originalImage: string;
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}