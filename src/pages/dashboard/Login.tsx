import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import { ShaderGradientHero } from '@/components/ShaderGradientHero';
import { HOME_HERO_BRAND_IMAGE } from '@/lib/preloadHomeHeroAssets';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message || 'Σφάλμα κατά τη σύνδεση');
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="dashboard-shell dashboard-shell--login">
      <ShaderGradientHero className="dashboard-shell__shader" bottomGrain organicSpot />
      <div className="dashboard-shell__veil" aria-hidden />

      <div className="dashboard-shell__login-wrap">
        <Card className="dashboard-shell__login-card">
          <CardHeader className="space-y-1 text-center">
            <div className="dashboard-shell__login-brand">
              <img
                src={HOME_HERO_BRAND_IMAGE}
                alt="ΔΕΥΑΑ"
                className="dashboard-shell__login-brand-image"
                decoding="async"
              />
            </div>
            <CardTitle className="dashboard-shell__login-title">ΔΕΥΑΑ Dashboard</CardTitle>
            <CardDescription className="dashboard-shell__login-desc">
              Συνδεθείτε για να διαχειριστείτε το περιεχόμενο της ιστοσελίδας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@deyaa.gr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Κωδικός</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="dashboard-shell__login-submit w-full" disabled={loading}>
                {loading ? (
                  'Σύνδεση...'
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" aria-hidden />
                    Σύνδεση
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
