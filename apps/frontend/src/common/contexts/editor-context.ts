import { createContext, useContext } from 'react';

export type Editor = {
  enabled: boolean;
  token: string | null;
  email: string | null;
  editor: boolean;
  rejected: boolean;
  signIn: (accessToken: string, expiresIn: number) => void;
  signOut: () => void;
};

const DEFAULT: Editor = {
  enabled: false,
  token: null,
  email: null,
  editor: false,
  rejected: false,
  signIn: () => undefined,
  signOut: () => undefined,
};

export const EditorContext = createContext<Editor>(DEFAULT);

export const useEditorContext = () => useContext(EditorContext);
