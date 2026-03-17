import { useState, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Star, ThumbsUp, ThumbsDown, Loader2, CheckCircle } from 'lucide-react';

interface ArticleFeedbackFormProps {
  articleId: number;
  onFeedbackSubmitted?: () => void;
}

export function ArticleFeedbackForm({ articleId, onFeedbackSubmitted }: ArticleFeedbackFormProps) {
  const { user } = useAuth();
  const { actions } = useAppStore('feedback');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isHelpful, setIsHelpful] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [existingFeedback, setExistingFeedback] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadExistingFeedback();
    loadMetrics();
  }, [articleId]);

  const loadExistingFeedback = async () => {
    try {
      const result = await actions.getAllFeedback({ articleId, userId: user?.userId });
      if (result.success && result.data.length > 0) {
        const feedback = result.data[0];
        setRating(feedback.rating);
        setIsHelpful(feedback.isHelpful === true ? 'yes' : feedback.isHelpful === false ? 'no' : '');
        setFeedbackText(feedback.feedbackText || '');
        setCategory(feedback.category || '');
        setExistingFeedback(true);
      }
    } catch (err) {
      // User hasn't provided feedback yet
    }
  };

  const loadMetrics = async () => {
    try {
      const result = await actions.getArticleMetrics(articleId);
      if (result.success) {
        setMetrics(result.data);
      }
    } catch (err) {
      console.error('Error loading metrics:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await actions.submitFeedback(articleId, {
        rating,
        isHelpful: isHelpful === 'yes' ? true : isHelpful === 'no' ? false : undefined,
        feedbackText: feedbackText.trim() || undefined,
        category: category || undefined,
      });

      if (result.success) {
        setSubmitted(true);
        setExistingFeedback(true);
        
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }

        setTimeout(() => {
          loadMetrics();
          setSubmitted(false);
        }, 2000);
      } else {
        setError(result.error.message || 'Failed to submit feedback');
      }
    } catch (err: any) {
      setError('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-4">
      {/* Metrics Display */}
      {metrics && metrics.totalFeedback > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Article Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {metrics.averageRating ? (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < Math.round(metrics.averageRating!)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </>
                  ) : (
                    <span className="text-muted-foreground">No ratings yet</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {metrics.averageRating?.toFixed(1) || 'N/A'} avg rating
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl">{metrics.totalFeedback}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-green-600">{metrics.helpfulCount}</p>
                <p className="text-sm text-muted-foreground">Helpful</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-red-600">{metrics.notHelpfulCount}</p>
                <p className="text-sm text-muted-foreground">Not Helpful</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {existingFeedback ? 'Update Your Feedback' : 'Rate This Article'}
          </CardTitle>
          <CardDescription>
            {existingFeedback
              ? 'You have already provided feedback. You can update it below.'
              : 'Help us improve by sharing your thoughts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              <p className="text-green-800">
                Thank you for your feedback! It helps us improve our content.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <Label>Rating *</Label>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(index + 1)}
                    onMouseEnter={() => setHoverRating(index + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        index < (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating > 0 && `${rating} out of 5 stars`}
                </span>
              </div>
            </div>

            {/* Helpful Toggle */}
            <div>
              <Label>Was this article helpful?</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant={isHelpful === 'yes' ? 'default' : 'outline'}
                  onClick={() => setIsHelpful('yes')}
                  className="flex-1"
                >
                  <ThumbsUp className="size-4 mr-2" />
                  Yes
                </Button>
                <Button
                  type="button"
                  variant={isHelpful === 'no' ? 'default' : 'outline'}
                  onClick={() => setIsHelpful('no')}
                  className="flex-1"
                >
                  <ThumbsDown className="size-4 mr-2" />
                  No
                </Button>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Feedback Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="mt-2">
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accuracy">Accuracy</SelectItem>
                  <SelectItem value="Clarity">Clarity</SelectItem>
                  <SelectItem value="Completeness">Completeness</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Text */}
            <div>
              <Label htmlFor="feedbackText">Additional Comments</Label>
              <Textarea
                id="feedbackText"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts about this article (optional)"
                rows={4}
                className="mt-2"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" disabled={submitting || rating === 0} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>{existingFeedback ? 'Update Feedback' : 'Submit Feedback'}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}