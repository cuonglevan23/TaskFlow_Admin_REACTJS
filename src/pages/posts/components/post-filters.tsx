import { useState } from 'react';
import { Search, Filter, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePosts } from '../context/posts-context';

export function PostFilters() {
  const {
    currentView,
    searchQuery,
    selectedUserId,
    loading,
    searchLoading,
    pagination,
    setCurrentView,
    fetchAllPosts,
    fetchTrendingPosts,
    fetchPostsByUser,
    searchPostsAction,
    refreshPosts,
    clearError,
  } = usePosts();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [userIdInput, setUserIdInput] = useState(selectedUserId?.toString() || '');

  const handleViewChange = async (view: 'all' | 'trending' | 'user' | 'search') => {
    setCurrentView(view);
    clearError();

    switch (view) {
      case 'all':
        await fetchAllPosts();
        break;
      case 'trending':
        await fetchTrendingPosts();
        break;
      case 'user':
        // Don't auto-fetch, wait for user ID input
        break;
      case 'search':
        // Don't auto-fetch, wait for search query
        break;
    }
  };

  const handleSearch = async () => {
    if (!localSearchQuery.trim()) return;

    setCurrentView('search');
    await searchPostsAction(localSearchQuery.trim());
  };

  const handleSearchByUser = async () => {
    const userId = parseInt(userIdInput);
    if (!userId || isNaN(userId)) return;

    setCurrentView('user');
    await fetchPostsByUser(userId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentView === 'search' || !currentView) {
        handleSearch();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* View Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={currentView === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('all')}
          disabled={loading}
        >
          <Filter className="h-4 w-4 mr-2" />
          Tất cả bài viết
        </Button>
        <Button
          variant={currentView === 'trending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('trending')}
          disabled={loading}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Xu hướng
        </Button>
        <Button
          variant={currentView === 'user' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('user')}
          disabled={loading}
        >
          <Users className="h-4 w-4 mr-2" />
          Theo người dùng
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshPosts}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Bar */}
        <div className="md:col-span-6">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm nội dung bài viết..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={searchLoading || !localSearchQuery.trim()}
            >
              {searchLoading ? 'Đang tìm...' : 'Tìm kiếm'}
            </Button>
          </div>
        </div>

        {/* User ID Filter */}
        <div className="md:col-span-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Nhập User ID..."
              type="number"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchByUser();
                }
              }}
            />
            <Button
              onClick={handleSearchByUser}
              disabled={loading || !userIdInput.trim()}
              variant="outline"
            >
              Lọc
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="md:col-span-2 flex items-center justify-end">
          {pagination && (
            <Badge variant="secondary" className="text-sm">
              {pagination.totalElements} bài viết
            </Badge>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap items-center gap-2">
        {currentView === 'search' && searchQuery && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Tìm kiếm: "{searchQuery}"
          </Badge>
        )}
        {currentView === 'user' && selectedUserId && (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            User ID: {selectedUserId}
          </Badge>
        )}
        {currentView === 'trending' && (
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            Xu hướng
          </Badge>
        )}
      </div>
    </div>
  );
}
