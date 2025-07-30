import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const TradingApp = () => {
  const [selectedDirection, setSelectedDirection] = useState<'LONG' | 'SHORT' | null>(null);
  const [ticker, setTicker] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const volumeReasons = [
    'Breakout', 'Support/Resistance', 'Volume Spike', 'News Catalyst',
    'Technical Pattern', 'Momentum', 'Oversold/Overbought', 'Market Structure'
  ];

  const handlePasteImage = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const url = URL.createObjectURL(blob);
            setScreenshot(url);
            return;
          }
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScreenshot(url);
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-colors ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trading Dashboard</h1>
          <p className="text-muted-foreground">Управление торговыми позициями</p>
        </div>

        <Tabs defaultValue="deal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="deal" className="flex items-center gap-2">
              <Icon name="TrendingUp" size={16} />
              Добавить Сделку
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Позиции
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Icon name="PieChart" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="h-80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Image" size={20} />
                      Скриншот сделки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <div className="h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
                      {screenshot ? (
                        <img 
                          src={screenshot} 
                          alt="Trading screenshot" 
                          className="max-h-full max-w-full object-contain rounded"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Icon name="ImagePlus" size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Нажмите кнопку ниже чтобы вставить изображение</p>
                          <p className="text-sm">или используйте Ctrl+V</p>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handlePasteImage}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      <Icon name="Clipboard" size={16} className="mr-2" />
                      Вставить изображение
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Target" size={20} />
                      Параметры сделки
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-3">
                      <Button
                        variant={selectedDirection === 'LONG' ? 'default' : 'outline'}
                        className={`flex-1 ${selectedDirection === 'LONG' 
                          ? 'bg-success hover:bg-success/90 text-success-foreground' 
                          : 'hover:bg-success/10 hover:text-success hover:border-success'
                        }`}
                        onClick={() => setSelectedDirection('LONG')}
                      >
                        <Icon name="TrendingUp" size={16} className="mr-2" />
                        LONG
                      </Button>
                      <Button
                        variant={selectedDirection === 'SHORT' ? 'default' : 'outline'}
                        className={`flex-1 ${selectedDirection === 'SHORT' 
                          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
                          : 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive'
                        }`}
                        onClick={() => setSelectedDirection('SHORT')}
                      >
                        <Icon name="TrendingDown" size={16} className="mr-2" />
                        SHORT
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticker">Тикер</Label>
                      <Input
                        id="ticker"
                        placeholder="BTC, ETH, 1000PEPE"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        className="text-lg font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="Activity" size={20} />
                      Объемы
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {volumeReasons.map((reason, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button size="lg" className="w-full">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить сделку
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BarChart3" size={20} />
                  Активные позиции
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Позиции будут отображаться здесь</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Общий P&L</p>
                      <p className="text-2xl font-bold text-success">+$2,340</p>
                    </div>
                    <Icon name="TrendingUp" size={24} className="text-success" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="text-2xl font-bold">68%</p>
                    </div>
                    <Icon name="Target" size={24} className="text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Сделок</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                    <Icon name="BarChart" size={24} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Объем</p>
                      <p className="text-2xl font-bold">$12.5K</p>
                    </div>
                    <Icon name="DollarSign" size={24} className="text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Settings" size={20} />
                  Конфигурация приложения
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Темная тема</Label>
                    <p className="text-sm text-muted-foreground">
                      Переключить между светлой и темной темой
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Валюта по умолчанию</Label>
                    <div className="mt-2">
                      <Input placeholder="USD" />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Размер позиции по умолчанию</Label>
                    <div className="mt-2">
                      <Input placeholder="100" type="number" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingApp;