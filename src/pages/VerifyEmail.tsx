import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifySubscriber } from '@/hooks/useSubscribers';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useI18n } from '@/i18n';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();
  const verifySubscriber = useVerifySubscriber();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorKind, setErrorKind] = useState<'missing' | 'invalid' | 'error' | null>(null);
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    // Prevent infinite loop - only attempt verification once
    if (hasAttemptedVerification.current) {
      return;
    }

    const token = searchParams.get('token')?.trim();

    if (!token) {
      setStatus('error');
      setErrorKind('missing');
      hasAttemptedVerification.current = true;
      return;
    }

    // Mark as attempted before making the request
    hasAttemptedVerification.current = true;

    // Verify the email
    verifySubscriber.mutate(token, {
      onSuccess: () => {
        setStatus('success');
        toast({
          title: t('verifyEmail.toastSuccessTitle'),
          description: t('verifyEmail.toastSuccessBody'),
        });
      },
      onError: (error: unknown) => {
        setStatus('error');
        const msg = error instanceof Error ? error.message : '';
        const invalid =
          msg === 'INVALID_TOKEN' ||
          /invalid|not found|έγκυρο|χρησιμοποιηθεί/i.test(msg);
        setErrorKind(invalid ? 'invalid' : 'error');
        toast({
          title: t('verifyEmail.toastErrorTitle'),
          description: invalid ? t('verifyEmail.invalid') : msg || t('verifyEmail.toastErrorBody'),
          variant: 'destructive',
        });
      },
    });
  }, [searchParams]); // Removed verifySubscriber and toast from dependencies

  const message =
    status === 'success'
      ? t('verifyEmail.successMessage')
      : errorKind
        ? t(`verifyEmail.${errorKind}`)
        : '';

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="page-shader-panel page-shader-panel--card max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">{t('verifyEmail.loadingTitle')}</h1>
              <p className="text-gray-600">{t('verifyEmail.loadingBody')}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-2xl font-bold mb-2 text-green-600">{t('verifyEmail.successTitle')}</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button onClick={() => navigate('/')} className="w-full">
                {t('verifyEmail.backHome')}
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-bold mb-2 text-red-600">{t('verifyEmail.errorTitle')}</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                  {t('common.home')}
                </Button>
                <Button onClick={() => navigate('/#footer-newsletter-title')} className="flex-1">
                  {t('verifyEmail.retry')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
