import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Wallet, 
  QrCode,
  Upload,
  Settings,
  Building2
} from 'lucide-react';

const PaymentMethodSetup = () => {
  const { toast } = useToast();

  const handleConfigSave = (methodType: string) => {
    toast({
      title: "Settings saved",
      description: `Configuration for ${methodType} has been updated successfully.`
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Payment Method Configuration</h2>
      <p className="text-muted-foreground">Configure and manage available payment methods.</p>

      <Tabs defaultValue="bank-transfer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bank-transfer" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Bank Transfer
          </TabsTrigger>
          <TabsTrigger value="card-payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card Payments
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Cryptocurrency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank-transfer">
          <Card>
            <CardHeader>
              <CardTitle>Bank Transfer Settings</CardTitle>
              <CardDescription>Configure bank account details for transfers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input placeholder="Enter bank name" />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input placeholder="Enter account number" />
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input placeholder="Enter account name" />
                </div>
              </div>
              <Button onClick={() => handleConfigSave('Bank Transfer')}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card-payments">
          <Card>
            <CardHeader>
              <CardTitle>Card Payment Settings</CardTitle>
              <CardDescription>Configure card payment gateway</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Payment Gateway</Label>
                  <Input placeholder="Select payment gateway" />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Enter API key" />
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="Enter webhook URL" />
                </div>
              </div>
              <Button onClick={() => handleConfigSave('Card Payments')}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrency Settings</CardTitle>
              <CardDescription>Configure cryptocurrency payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Bitcoin (BTC)</h4>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input placeholder="Enter BTC wallet address" />
                  </div>
                  <div className="space-y-2">
                    <Label>QR Code</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload QR code image or drag and drop
                      </p>
                      <Button variant="outline" size="sm">Choose File</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ethereum (ETH)</h4>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input placeholder="Enter ETH wallet address" />
                  </div>
                  <div className="space-y-2">
                    <Label>QR Code</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload QR code image or drag and drop
                      </p>
                      <Button variant="outline" size="sm">Choose File</Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={() => handleConfigSave('Cryptocurrency')}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentMethodSetup;
