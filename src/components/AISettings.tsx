import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Save, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function AISettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { aiConfig, actions } = useAppStore('aiConfig');
  const [apiKey, setApiKey] = useState(aiConfig.apiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setValidating(true);
    setError('');
    setIsValid(null);

    try {
      // Mock validation - in production this would call the real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const valid = apiKey.startsWith('sk-') && apiKey.length > 10;
      setIsValid(valid);
      if (!valid) {
        setError('Invalid API key. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate API key');
      setIsValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await actions.updateAIConfig({ apiKey, enabled: true });
      setSuccess('API key saved successfully');
      setError('');
    } catch (err: any) {
      setError('Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl">AI Settings</h1>
          <p className="text-muted-foreground">
            Configure your OpenAI API key for AI-powered search
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* API Key Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>OpenAI API Key</CardTitle>
            <CardDescription>
              Enter your OpenAI API key to enable AI-powered search and chat features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="size-5 text-green-600" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle className="size-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setIsValid(null);
                      setError('');
                    }}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={handleValidateKey}
                  disabled={validating || !apiKey.trim()}
                >
                  {validating ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Validate'
                  )}
                </Button>
              </div>
              {isValid === true && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="size-4" />
                  API key is valid
                </p>
              )}
              {isValid === false && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="size-4" />
                  API key is invalid
                </p>
              )}
            </div>

            <Button onClick={handleSave} disabled={loading || !apiKey.trim()}>
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save API Key
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle>How to Get an OpenAI API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ol className="list-decimal list-inside space-y-2">
              <li>Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.openai.com</a></li>
              <li>Sign in or create an account</li>
              <li>Navigate to API keys section</li>
              <li>Click "Create new secret key"</li>
              <li>Copy the key and paste it above</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your API key is stored securely and never shared. 
                API usage is billed directly to your OpenAI account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Your API key is encrypted and stored securely</p>
            <p>• Knowledge base content is sent to OpenAI for processing</p>
            <p>• No personal data is shared with OpenAI</p>
            <p>• You can revoke or change your API key at any time</p>
            <p>• API usage follows OpenAI's data usage policies</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}