import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BookOpen, Shield, Users, Loader2, UserCog } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actions } = useAppStore('auth');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await actions.login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error?.message || 'Invalid email or password');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, demoPassword: string = 'Password123!') => {
    setError('');
    setLoading(true);

    try {
      const result = await actions.login(demoEmail, demoPassword);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error?.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      email: 'admin@company.com',
      label: 'Admin User',
      description: 'Full access - Create, edit, approve articles',
      icon: Shield,
      iconColor: 'text-brand-error',
      bgColor: 'bg-brand-error-light',
    },
    {
      email: 'support@company.com',
      label: 'Support User',
      description: 'Review requests and manage workflows',
      icon: UserCog,
      iconColor: 'text-brand-primary',
      bgColor: 'bg-brand-primary-light',
    },
    {
      email: 'user@client1.com',
      label: 'Client User (Acme Corporation)',
      description: 'Search articles and request documentation',
      icon: BookOpen,
      iconColor: 'text-brand-success',
      bgColor: 'bg-brand-success-light',
    },
    {
      email: 'user@client2.com',
      label: 'Client User (Global Tech Inc)',
      description: 'Access client-specific documentation',
      icon: Users,
      iconColor: 'text-brand-secondary',
      bgColor: 'bg-brand-secondary-light',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-light to-brand-secondary-light p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-brand-primary-light rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-brand-primary" />
            </div>
          </div>
          <h1 className="text-4xl text-brand-main mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Comprehensive documentation and support system
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Sign In Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access the knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <div className="text-sm text-brand-error bg-brand-error-light p-3 rounded-md border border-brand-error-mid">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Test Credentials Info */}
              <div className="mt-4 p-4 bg-brand-primary-light rounded-lg border border-brand-secondary">
                <p className="text-sm font-medium text-brand-main mb-2">Test Credentials:</p>
                <div className="text-xs text-brand-primary space-y-1">
                  <p>Password for all accounts: Password123!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts Card */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Accounts</CardTitle>
              <CardDescription>
                Quick access to different role types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoAccounts.map(account => {
                const Icon = account.icon;
                return (
                  <Card
                    key={account.email}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-brand-primary"
                    onClick={() => !loading && quickLogin(account.email)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${account.bgColor}`}>
                          <Icon className={`w-5 h-5 ${account.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{account.label}</p>
                          <p className="text-xs text-muted-foreground">{account.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
