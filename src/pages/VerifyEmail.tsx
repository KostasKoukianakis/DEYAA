import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifySubscriber } from '@/hooks/useSubscribers';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const verifySubscriber = useVerifySubscriber();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    // Prevent infinite loop - only attempt verification once
    if (hasAttemptedVerification.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Λείπει το token επιβεβαίωσης. Παρακαλώ χρησιμοποιήστε τον σύνδεσμο από το email σας.');
      hasAttemptedVerification.current = true;
      return;
    }

    // Mark as attempted before making the request
    hasAttemptedVerification.current = true;

    // Verify the email
    verifySubscriber.mutate(token, {
      onSuccess: () => {
        setStatus('success');
        setMessage('Η εγγραφή σας επιβεβαιώθηκε επιτυχώς! Θα λαμβάνετε ενημερώσεις στο email σας.');
        toast({
          title: 'Επιβεβαίωση επιτυχής',
          description: 'Η εγγραφή σας ολοκληρώθηκε.',
        });
      },
      onError: (error: any) => {
        setStatus('error');
        const msg = error?.message || '';
        if (msg.includes('Invalid') || msg.includes('not found')) {
          setMessage('Το token επιβεβαίωσης δεν είναι έγκυρο ή έχει λήξει. Παρακαλώ δοκιμάστε να εγγραφείτε ξανά.');
        } else {
          setMessage('Προέκυψε σφάλμα κατά την επιβεβαίωση. Παρακαλώ δοκιμάστε ξανά αργότερα.');
        }
        toast({
          title: 'Σφάλμα επιβεβαίωσης',
          description: msg || 'Δεν ήταν δυνατή η επιβεβαίωση της εγγραφής σας.',
          variant: 'destructive',
        });
      },
    });
  }, [searchParams]); // Removed verifySubscriber and toast from dependencies

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Επιβεβαίωση...</h1>
              <p className="text-gray-600">Παρακαλώ περιμένετε...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h1 className="text-2xl font-bold mb-2 text-green-600">Επιβεβαίωση Επιτυχής!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button onClick={() => navigate('/')} className="w-full">
                Επιστροφή στην Αρχική
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h1 className="text-2xl font-bold mb-2 text-red-600">Σφάλμα Επιβεβαίωσης</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex gap-3">
                <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                  Αρχική Σελίδα
                </Button>
                <Button onClick={() => navigate('/contact')} className="flex-1">
                  Επικοινωνία
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
