import { Bell, Trash2, ExternalLink, TrendingDown, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { PriceAlert } from '../App';
import { formatPrice } from '../lib/utils';

interface PriceAlertsProps {
  alerts: PriceAlert[];
  onRemove: (id: string) => void;
}

export function PriceAlerts({ alerts, onRemove }: PriceAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">沒有降價提醒</h3>
          <p className="text-gray-500">在比價結果中點擊「降價提醒」來監控商品價格</p>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(a => !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-orange-500" />
            <span>降價提醒</span>
          </CardTitle>
          <CardDescription>
            共設定 {alerts.length} 個價格提醒，{activeAlerts.length} 個進行中
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Active Alerts */}
          {activeAlerts.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <TrendingDown className="w-4 h-4 mr-2 text-orange-500" />
                進行中的提醒 ({activeAlerts.length})
              </h3>
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200"
                  >
                    <div className="flex items-center space-x-4">
                      {alert.imageUrl && (
                        <img
                          src={alert.imageUrl}
                          alt={alert.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {alert.productName}
                        </p>
                        <div className="flex items-center space-x-3 text-sm mt-1">
                          <span className="text-gray-500">
                            目前: {formatPrice(alert.currentPrice)}
                          </span>
                          <span className="text-orange-600 font-medium">
                            目標: {formatPrice(alert.targetPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {alert.platform} • 設定於 {new Date(alert.createdAt).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(alert.productUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemove(alert.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Triggered Alerts */}
          {triggeredAlerts.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                已達標的提醒 ({triggeredAlerts.length})
              </h3>
              <div className="space-y-3">
                {triggeredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200"
                  >
                    <div className="flex items-center space-x-4">
                      {alert.imageUrl && (
                        <img
                          src={alert.imageUrl}
                          alt={alert.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {alert.productName}
                        </p>
                        <p className="text-sm text-green-600 font-medium mt-1">
                          價格已達到目標 {formatPrice(alert.targetPrice)}！
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(alert.productUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        立即購買
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRemove(alert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardContent className="py-4">
          <h4 className="font-medium text-gray-800 mb-2">使用提示</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 設定目標價格後，系統會在下次搜尋時檢查價格</li>
            <li>• 建議定期搜尋來更新價格資訊</li>
            <li>• 可同時設定多個商品的降價提醒</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
