import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface VolumeTag {
  value: number;
  count: number;
}

const TradingApp = () => {
  const [selectedDirection, setSelectedDirection] = useState<'LONG' | 'SHORT' | null>(null);
  const [ticker, setTicker] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [volumeTags, setVolumeTags] = useState<Record<number, VolumeTag>>({
    10: { value: 10, count: 0 },
    50: { value: 50, count: 0 },
    100: { value: 100, count: 0 },
    500: { value: 500, count: 0 },
    1000: { value: 1000, count: 0 }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reasonTags = [
    'Breakout', 'Support/Resistance', 'Volume Spike', 'News Catalyst',
    'Technical Pattern', 'Momentum', 'Oversold/Overbought', 'Market Structure'
  ];
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const totalVolume = Object.values(volumeTags).reduce((sum, tag) => sum + (tag.value * tag.count), 0);

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
      alert('Для вставки изображений разрешите доступ к буферу обмена');
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      handlePasteImage();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScreenshot(url);
    }
  };

  const handleVolumeTagClick = (value: number, isRightClick = false) => {
    setVolumeTags(prev => ({
      ...prev,
      [value]: {
        ...prev[value],
        count: isRightClick 
          ? Math.max(0, prev[value].count - 1)
          : prev[value].count + 1
      }
    }));
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  return (
    <div className={`h-screen bg-background transition-colors overflow-hidden ${darkMode ? 'dark' : ''}`}>
      <div className="h-full flex flex-col p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Trading Dashboard</h1>
          <p className="text-muted-foreground">Управление торговыми позициями</p>
        </div>

        <Tabs defaultValue="deal" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-6 relative">
            <TabsTrigger value="deal" className="flex items-center gap-2 transition-all">
              <Icon name="TrendingUp" size={16} />
              Добавить Сделку
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2 transition-all">
              <Icon name="BarChart3" size={16} />
              Позиции
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 transition-all">
              <Icon name="PieChart" size={16} />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 transition-all">
              <Icon name="Settings" size={16} />
              Настройки
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="deal" className="h-full m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <div className="space-y-6">
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="Image" size={20} />
                        Скриншот сделки
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex-1 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20 min-h-[300px]">
                        {screenshot ? (
                          <img 
                            src={screenshot} 
                            alt="Trading screenshot" 
                            className="max-h-full max-w-full object-contain rounded"
                          />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <Icon name="ImagePlus" size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">Нажмите кнопку ниже или Ctrl+V</p>
                            <p className="text-sm opacity-75">чтобы вставить изображение</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Button 
                          onClick={handlePasteImage}
                          className="flex-1"
                          variant="outline"
                        >
                          <Icon name="Clipboard" size={16} className="mr-2" />
                          Вставить из буфера
                        </Button>
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                        >
                          <Icon name="Upload" size={16} className="mr-2" />
                          Файл
                        </Button>
                      </div>
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
                  <Card className="animate-fade-in">
                    <CardContent className="p-6 space-y-6">
                      <div className="flex gap-3">
                        <Button
                          variant={selectedDirection === 'LONG' ? 'default' : 'outline'}
                          className={`flex-1 transition-all ${selectedDirection === 'LONG' 
                            ? 'bg-success hover:bg-success/90 text-success-foreground shadow-lg scale-105' 
                            : 'hover:bg-success/10 hover:text-success hover:border-success'
                          }`}
                          onClick={() => setSelectedDirection('LONG')}
                        >
                          <Icon name="TrendingUp" size={16} className="mr-2" />
                          LONG
                        </Button>
                        <Button
                          variant={selectedDirection === 'SHORT' ? 'default' : 'outline'}
                          className={`flex-1 transition-all ${selectedDirection === 'SHORT' 
                            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg scale-105' 
                            : 'hover:bg-destructive/10 hover:text-destructive hover:border-destructive'
                          }`}
                          onClick={() => setSelectedDirection('SHORT')}
                        >
                          <Icon name="TrendingDown" size={16} className="mr-2" />
                          SHORT
                        </Button>
                        <Input
                          placeholder="BTC, ETH, 1000PEPE"
                          value={ticker}
                          onChange={(e) => setTicker(e.target.value)}
                          className="flex-1 text-lg font-mono"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Icon name="DollarSign" size={18} />
                            Объемы
                            <span className="ml-auto text-primary font-bold">${totalVolume}</span>
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {Object.values(volumeTags).map((tag) => (
                              <Button
                                key={tag.value}
                                variant={tag.count > 0 ? 'default' : 'outline'}
                                size="lg"
                                className={`transition-all duration-300 ${tag.count > 0 
                                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg scale-105' 
                                  : 'hover:bg-primary/10 hover:text-primary hover:border-primary hover:scale-105'
                                }`}
                                onClick={() => handleVolumeTagClick(tag.value)}
                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  handleVolumeTagClick(tag.value, true);
                                }}
                              >
                                ${tag.value}
                                {tag.count > 0 && (
                                  <span className="ml-2 text-xs opacity-90">x{tag.count}</span>
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Icon name="Activity" size={18} />
                            Основания для входа
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {reasonTags.map((reason) => (
                              <Badge 
                                key={reason} 
                                variant={selectedReasons.includes(reason) ? 'default' : 'secondary'}
                                className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 ${
                                  selectedReasons.includes(reason)
                                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg scale-105'
                                    : 'hover:bg-primary/10 hover:text-primary hover:scale-105'
                                }`}
                                onClick={() => toggleReason(reason)}
                              >
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button size="lg" className="w-full mt-6 text-lg">
                          <Icon name="Plus" size={20} className="mr-2" />
                          Добавить сделку
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="positions" className="h-full m-0">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Активные позиции
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Icon name="TrendingUp" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Позиции будут отображаться здесь</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="animate-scale-in">
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
                
                <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
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

                <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
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

                <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
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

            <TabsContent value="settings" className="h-full m-0">
              <Card className="max-w-2xl">
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
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingApp;