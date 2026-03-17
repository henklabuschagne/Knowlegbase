import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../hooks/useAppStore';
import type {
  AdvancedSearchRequest,
  SearchResultArticle,
  SearchFacets,
  SavedSearch,
  SearchHistoryDto,
} from '../types/dto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Search,
  Filter,
  Save,
  History,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Eye,
  Calendar,
  User,
  Loader2,
  BookmarkPlus,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

export function AdvancedSearch() {
  const navigate = useNavigate();
  const { tags: allTags, articles: storeArticles, actions } = useAppStore('articles', 'tags', 'search');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvancedSearchRequest>({
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'CreatedAt',
    sortOrder: 'DESC',
  });
  const [results, setResults] = useState<SearchResultArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [facets, setFacets] = useState<SearchFacets | null>(null);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryDto[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [saveAsPublic, setSaveAsPublic] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  useEffect(() => {
    loadFacets();
    loadSavedSearches();
    loadSearchHistory();
  }, []);

  useEffect(() => {
    if (searchQuery || Object.keys(filters).length > 4) {
      performSearch();
    }
  }, [filters.pageNumber, filters.sortBy, filters.sortOrder]);

  const loadFacets = async () => {
    try {
      const result = await actions.getSearchFacets();
      if (result.success) {
        setFacets(result.data);
      }
    } catch (err) {
      console.error('Error loading facets:', err);
    }
  };

  const loadSavedSearches = async () => {
    try {
      const result = await actions.getSavedSearches();
      if (result.success) {
        setSavedSearches(result.data);
      }
    } catch (err) {
      console.error('Error loading saved searches:', err);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const result = await actions.getSearchHistory(10);
      if (result.success) {
        setSearchHistory(result.data);
      }
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchRequest: AdvancedSearchRequest = {
        ...filters,
        searchQuery: searchQuery || undefined,
      };
      const result = await actions.advancedSearch(searchRequest);
      if (result.success) {
        setResults(result.data.articles);
        setTotalCount(result.data.totalCount);
        setTotalPages(result.data.totalPages);
      }
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, pageNumber: 1 });
    performSearch();
  };

  const handleFilterChange = (key: keyof AdvancedSearchRequest, value: any) => {
    setFilters({ ...filters, [key]: value, pageNumber: 1 });
  };

  const handleToggleTagFilter = (tagId: number) => {
    const currentTags = filters.tagIds || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    handleFilterChange('tagIds', newTags.length > 0 ? newTags : undefined);
  };

  const handleToggleStatusFilter = (statusId: number) => {
    const currentStatuses = filters.statusIds || [];
    const newStatuses = currentStatuses.includes(statusId)
      ? currentStatuses.filter((id) => id !== statusId)
      : [...currentStatuses, statusId];
    handleFilterChange('statusIds', newStatuses.length > 0 ? newStatuses : undefined);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'CreatedAt',
      sortOrder: 'DESC',
    });
    setResults([]);
    setTotalCount(0);
  };

  const handleSaveSearch = async () => {
    if (!saveSearchName.trim()) return;

    try {
      await actions.saveSearch({
        searchName: saveSearchName,
        searchQuery: searchQuery || undefined,
        filterCriteria: filters,
        isPublic: saveAsPublic,
      });
      setShowSaveDialog(false);
      setSaveSearchName('');
      setSaveAsPublic(false);
      loadSavedSearches();
    } catch (err) {
      console.error('Error saving search:', err);
    }
  };

  const handleLoadSavedSearch = async (savedSearch: SavedSearch) => {
    try {
      await actions.useSavedSearch(savedSearch.savedSearchId);
      const criteria = JSON.parse(savedSearch.filterCriteria) as AdvancedSearchRequest;
      setSearchQuery(savedSearch.searchQuery || '');
      setFilters(criteria);
      performSearch();
    } catch (err) {
      console.error('Error loading saved search:', err);
    }
  };

  const handleDeleteSavedSearch = async (savedSearchId: number) => {
    if (!confirm('Delete this saved search?')) return;
    try {
      await actions.deleteSavedSearch(savedSearchId);
      loadSavedSearches();
    } catch (err) {
      console.error('Error deleting saved search:', err);
    }
  };

  const handleLoadFromHistory = (history: SearchHistoryDto) => {
    setSearchQuery(history.searchQuery);
    if (history.filterCriteria) {
      const criteria = JSON.parse(history.filterCriteria) as AdvancedSearchRequest;
      setFilters(criteria);
    }
    performSearch();
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.statusIds?.length) count++;
    if (filters.tagIds?.length) count++;
    if (filters.authorId) count++;
    if (filters.isInternal !== undefined || filters.isExternal !== undefined) count++;
    if (filters.createdAfter || filters.createdBefore) count++;
    if (filters.minRating) count++;
    if (filters.minViewCount) count++;
    return count;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl flex items-center gap-2 mb-2">
          <Search className="size-8" />
          Advanced Search
        </h1>
        <p className="text-muted-foreground">
          Search and filter knowledge base articles with advanced criteria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="size-5" />
                  Filters
                  {activeFilterCount() > 0 && (
                    <Badge variant="secondary">{activeFilterCount()}</Badge>
                  )}
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="size-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Filter */}
              {facets && facets.statuses.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <Label>Status</Label>
                    <ChevronDown className="size-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {facets.statuses.map((status) => (
                      <div key={status.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.statusIds?.includes(status.id!)}
                          onCheckedChange={() => handleToggleStatusFilter(status.id!)}
                        />
                        <span className="text-sm flex-1">{status.name}</span>
                        <span className="text-xs text-muted-foreground">({status.count})</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              <Separator />

              {/* Tags Filter */}
              {facets && facets.tags.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <Label>Tags</Label>
                    <ChevronDown className="size-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                    {facets.tags.map((tag) => (
                      <div key={tag.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={filters.tagIds?.includes(tag.id!)}
                          onCheckedChange={() => handleToggleTagFilter(tag.id!)}
                        />
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: tag.colorCode || undefined,
                            backgroundColor: tag.colorCode ? `${tag.colorCode}20` : undefined,
                          }}
                          className="text-xs flex-1"
                        >
                          {tag.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">({tag.count})</span>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}

              <Separator />

              {/* Visibility Filter */}
              <div>
                <Label className="mb-2 block">Visibility</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.isInternal === true}
                      onCheckedChange={(checked) =>
                        handleFilterChange('isInternal', checked ? true : undefined)
                      }
                    />
                    <span className="text-sm">Internal Only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={filters.isExternal === true}
                      onCheckedChange={(checked) =>
                        handleFilterChange('isExternal', checked ? true : undefined)
                      }
                    />
                    <span className="text-sm">External Only</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rating Filter */}
              <div>
                <Label htmlFor="minRating">Minimum Rating</Label>
                <Select
                  value={filters.minRating?.toString() || 'any'}
                  onValueChange={(value) =>
                    handleFilterChange('minRating', value === 'any' ? undefined : parseFloat(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="2">2+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* View Count Filter */}
              <div>
                <Label htmlFor="minViewCount">Minimum Views</Label>
                <Input
                  id="minViewCount"
                  type="number"
                  placeholder="e.g., 100"
                  value={filters.minViewCount || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'minViewCount',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Saved Searches */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BookmarkPlus className="size-4" />
                Saved Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {savedSearches.length > 0 ? (
                <div className="space-y-2">
                  {savedSearches.slice(0, 5).map((saved) => (
                    <div
                      key={saved.savedSearchId}
                      className="flex items-center justify-between text-sm p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleLoadSavedSearch(saved)}
                    >
                      <span className="flex-1 truncate">{saved.searchName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSavedSearch(saved.savedSearchId);
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No saved searches</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                  Search
                </Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                  <Save className="size-4" />
                </Button>
              </div>

              {/* Sort and Display Options */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Label>Sort by:</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Relevance">Relevance</SelectItem>
                      <SelectItem value="CreatedAt">Date Created</SelectItem>
                      <SelectItem value="UpdatedAt">Last Updated</SelectItem>
                      <SelectItem value="Title">Title</SelectItem>
                      <SelectItem value="ViewCount">View Count</SelectItem>
                      <SelectItem value="Rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => handleFilterChange('sortOrder', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DESC">Descending</SelectItem>
                      <SelectItem value="ASC">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          {totalCount > 0 && (
            <p className="text-sm text-muted-foreground">
              Found {totalCount} article{totalCount !== 1 ? 's' : ''}
            </p>
          )}

          {/* Results List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((article) => (
                <Card
                  key={article.articleId}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/articles/${article.articleId}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <Badge>{article.statusName}</Badge>
                    </div>
                    {article.summary && (
                      <CardDescription>{article.summary}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="size-4" />
                        {article.authorName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {formatDate(article.createdAt)}
                      </div>
                      {article.viewCount !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="size-4" />
                          {article.viewCount} views
                        </div>
                      )}
                      {article.averageRating !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          {article.averageRating.toFixed(1)}
                        </div>
                      )}
                      {article.isInternal && <Badge variant="outline">Internal</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {searchQuery || activeFilterCount() > 0
                  ? 'No articles found matching your criteria'
                  : 'Enter a search query or apply filters to find articles'}
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={filters.pageNumber === 1}
                onClick={() => handleFilterChange('pageNumber', filters.pageNumber! - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.pageNumber} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={filters.pageNumber === totalPages}
                onClick={() => handleFilterChange('pageNumber', filters.pageNumber! + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Save Search Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
            <DialogDescription>
              Save this search configuration for quick access later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="searchName">Search Name</Label>
              <Input
                id="searchName"
                value={saveSearchName}
                onChange={(e) => setSaveSearchName(e.target.value)}
                placeholder="e.g., Recent High-Rated Articles"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={saveAsPublic} onCheckedChange={(checked) => setSaveAsPublic(checked as boolean)} />
              <Label>Make this search public (visible to all users)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSearch} disabled={!saveSearchName.trim()}>
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}