import { EditorContext } from '@/common/contexts/editor-context';
import useEditor from '@/features/auth/use-editor';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { type ReactNode, useMemo } from 'react';

type EditorProviderProps = { children: ReactNode };

const EditorProvider = ({ children }: EditorProviderProps) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const { token, email, editor, rejected, signIn, signOut } = useEditor();
  const value = useMemo(
    () => ({ enabled: Boolean(clientId), token, email, editor, rejected, signIn, signOut }),
    [clientId, token, email, editor, rejected, signIn, signOut],
  );
  const content = <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;

  return clientId ? <GoogleOAuthProvider clientId={clientId}>{content}</GoogleOAuthProvider> : content;
};

export default EditorProvider;
