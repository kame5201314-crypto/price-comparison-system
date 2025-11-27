import { History, Search, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { SearchHistoryItem } from '../App';
import { formatPrice } from '../lib/utils';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSearch: (keyword: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSearch, onClear }: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">沒有搜尋記錄</h3>
          <p className="text-gray-500">您的搜尋記錄將顯示在這裡</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    if (days < 7) return `${days} 天前`;
    return date.toLocaleDateString('zh-TW');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-6 h-6 text-blue-500" />
                <span>搜尋記錄</span>
              </CardTitle>
              <CardDescription>
                最近 {history.length} 筆搜尋記錄
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清除全部
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSearch(item.keyword)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.keyword}</p>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span>找到 {item.resultCount} 個結果</span>
                      {item.lowestPrice && (
                        <span className="text-green-600">
                          最低 {formatPrice(item.lowestPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(item.searchedAt)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
