import RoundIconButton from '@/common/components/buttons/round-icon-button';
import { useEditorContext } from '@/common/contexts/editor-context';
import NavigationAuthDialog from '@/features/navigation/buttons/navigation-auth-dialog';
import NavigationActionButton from '@/features/navigation/buttons/navigation-action-button';
import Google from '@mui/icons-material/Google';
import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type NavigationAuthButtonProps = { variant: 'bar' | 'drawer' };

const NavigationAuthButtonView = ({
  variant,
  signedIn,
  label,
  onClick,
}: NavigationAuthButtonProps & { signedIn: boolean; label: string; onClick: () => void }) => {
  const icon = signedIn ? Logout : Google;
  return variant === 'bar' ? (
    <RoundIconButton icon={icon} label={label} onClick={onClick} />
  ) : (
    <NavigationActionButton icon={icon} label={label} onClick={onClick} />
  );
};

const SignIn = ({ variant }: NavigationAuthButtonProps) => {
  const { t } = useTranslation();
  const { rejected, signIn } = useEditorContext();
  const [asking, setAsking] = useState(false);
  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: (r) => signIn(r.access_token, r.expires_in),
    onError: () => undefined,
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
      {rejected && (
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            minWidth: 0,
            whiteSpace: variant === 'bar' ? 'nowrap' : 'normal',
            lineHeight: 1.2,
            marginRight: '8px',
          }}
        >
          {t('auth.notOwner')}
        </Typography>
      )}
      <NavigationAuthButtonView
        variant={variant}
        signedIn={false}
        label={t('auth.signIn')}
        onClick={() => setAsking(true)}
      />
      <NavigationAuthDialog
        open={asking}
        onConfirm={() => {
          setAsking(false);
          login();
        }}
        onClose={() => setAsking(false)}
      />
    </Box>
  );
};

const NavigationAuthButton = ({ variant }: NavigationAuthButtonProps) => {
  const { t } = useTranslation();
  const { enabled, editor, signOut } = useEditorContext();

  if (editor) {
    return (
      <NavigationAuthButtonView
        variant={variant}
        signedIn
        label={t('auth.signOut')}
        onClick={signOut}
      />
    );
  }

  return enabled ? <SignIn variant={variant} /> : null;
};

export default NavigationAuthButton;
