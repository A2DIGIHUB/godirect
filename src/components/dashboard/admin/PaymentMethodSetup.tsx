
import React, { useState } from 'react';
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
  Building2,
  Check,
  Landmark,
  Smartphone,
  ArrowRightLeft,
  AlertCircle
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethodConfig {
  enabled: boolean;
  details: Record<string, string>;
  instructions?: string;
}

const PaymentMethodSetup = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showTestSuccess, setShowTestSuccess] = useState(false);
  
  const [bankConfig, setBankConfig] = useState<PaymentMethodConfig>({
    enabled: true,
    details: {
      bankName: 'First Bank Nigeria',
      accountNumber: '2073825910',
      accountName: 'GODIRECT PROPERTIES LTD',
      branchCode: '221',
      swiftCode: 'FBNING'
    },
    instructions: 'Make a direct transfer to our account and upload proof of payment.'
  });
  
  const [cardConfig, setCardConfig] = useState<PaymentMethodConfig>({
    enabled: true,
    details: {
      gateway: 'Paystack',
      merchantId: 'GDR-PRPTY-12345',
      callbackUrl: 'https://godirect.ng/payment/callback',
      apiVersion: '2.1'
    }
  });
  
  const [cryptoConfig, setCryptoConfig] = useState<PaymentMethodConfig>({
    enabled: true,
    details: {
      btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ethAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      usdtAddress: 'TKGsba8guyr4hbdw6avaBdYB2zBNQBwJPP',
      network: 'Multiple (BTC, ETH, BEP20)'
    },
    instructions: 'Please only send the equivalent amount in cryptocurrency. Transaction will be confirmed after 3 network confirmations.'
  });
  
  const [mobileMoneyConfig, setMobileMoneyConfig] = useState<PaymentMethodConfig>({
    enabled: false,
    details: {
      provider: 'MTN MoMo',
      merchantNumber: '0712345678',
      businessName: 'GoDirect Properties'
    },
    instructions: 'Pay using your mobile money account and use the property ID as reference.'
  });

  const handleConfigSave = (methodType: string) => {
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: `Configuration for ${methodType} has been updated successfully.`
      });
    }, 1000);
  };

  const handleTestIntegration = () => {
    toast({
      title: "Testing integration",
      description: "Running test connection to payment gateway..."
    });
    
    setTimeout(() => {
      setShowTestSuccess(true);
      setTimeout(() => setShowTestSuccess(false), 3000);
    }, 2000);
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, we would upload this file to storage
      toast({
        title: "QR Code uploaded",
        description: "Your QR code has been uploaded successfully"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Payment Method Configuration</h2>
      <p className="text-muted-foreground">Configure and manage available payment methods for your properties.</p>

      {showTestSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-800" />
          <AlertDescription>
            Test connection successful! Your payment gateway is properly configured.
          </AlertDescription>
        </Alert>
      )}

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
          <TabsTrigger value="mobile-money" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile Money
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank-transfer">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bank Transfer Settings</CardTitle>
                  <CardDescription>Configure bank account details for transfers</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Enabled</span>
                  <Switch 
                    checked={bankConfig.enabled} 
                    onCheckedChange={(checked) => setBankConfig({...bankConfig, enabled: checked})}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input 
                    placeholder="Enter bank name" 
                    value={bankConfig.details.bankName}
                    onChange={(e) => setBankConfig({
                      ...bankConfig, 
                      details: {...bankConfig.details, bankName: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input 
                    placeholder="Enter account number" 
                    value={bankConfig.details.accountNumber}
                    onChange={(e) => setBankConfig({
                      ...bankConfig, 
                      details: {...bankConfig.details, accountNumber: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input 
                    placeholder="Enter account name" 
                    value={bankConfig.details.accountName}
                    onChange={(e) => setBankConfig({
                      ...bankConfig, 
                      details: {...bankConfig.details, accountName: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Branch Code (Optional)</Label>
                  <Input 
                    placeholder="Enter branch code" 
                    value={bankConfig.details.branchCode}
                    onChange={(e) => setBankConfig({
                      ...bankConfig, 
                      details: {...bankConfig.details, branchCode: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Swift Code (International Transfers)</Label>
                  <Input 
                    placeholder="Enter SWIFT code" 
                    value={bankConfig.details.swiftCode}
                    onChange={(e) => setBankConfig({
                      ...bankConfig, 
                      details: {...bankConfig.details, swiftCode: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Payment Instructions</Label>
                <Textarea 
                  placeholder="Instructions for clients making bank transfers" 
                  className="min-h-[100px]"
                  value={bankConfig.instructions}
                  onChange={(e) => setBankConfig({...bankConfig, instructions: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={() => handleConfigSave('Bank Transfer')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="card-payments">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Card Payment Settings</CardTitle>
                  <CardDescription>Configure card payment gateway</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Enabled</span>
                  <Switch 
                    checked={cardConfig.enabled} 
                    onCheckedChange={(checked) => setCardConfig({...cardConfig, enabled: checked})}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Payment Gateway</Label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm">
                    <option value="paystack">Paystack</option>
                    <option value="flutterwave">Flutterwave</option>
                    <option value="interswitch">Interswitch</option>
                    <option value="monnify">Monnify</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Merchant ID</Label>
                  <Input 
                    placeholder="Enter merchant ID" 
                    value={cardConfig.details.merchantId}
                    onChange={(e) => setCardConfig({
                      ...cardConfig, 
                      details: {...cardConfig.details, merchantId: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input 
                    type="password" 
                    placeholder="Enter API key" 
                    value="sk_live_xxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Callback URL</Label>
                  <Input 
                    placeholder="Enter callback URL" 
                    value={cardConfig.details.callbackUrl}
                    onChange={(e) => setCardConfig({
                      ...cardConfig, 
                      details: {...cardConfig.details, callbackUrl: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Version</Label>
                  <Input 
                    placeholder="Enter API version" 
                    value={cardConfig.details.apiVersion}
                    onChange={(e) => setCardConfig({
                      ...cardConfig, 
                      details: {...cardConfig.details, apiVersion: e.target.value}
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Accepted Cards</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="visa" defaultChecked />
                    <label htmlFor="visa" className="text-sm font-medium">Visa</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="mastercard" defaultChecked />
                    <label htmlFor="mastercard" className="text-sm font-medium">Mastercard</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="verve" defaultChecked />
                    <label htmlFor="verve" className="text-sm font-medium">Verve</label>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleConfigSave('Card Payments')}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleTestIntegration}
                  disabled={saving}
                >
                  Test Integration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cryptocurrency Settings</CardTitle>
                  <CardDescription>Configure cryptocurrency payment options</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Enabled</span>
                  <Switch 
                    checked={cryptoConfig.enabled} 
                    onCheckedChange={(checked) => setCryptoConfig({...cryptoConfig, enabled: checked})}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Bitcoin (BTC)</h4>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input 
                      placeholder="Enter BTC wallet address" 
                      value={cryptoConfig.details.btcAddress}
                      onChange={(e) => setCryptoConfig({
                        ...cryptoConfig, 
                        details: {...cryptoConfig.details, btcAddress: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>QR Code</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload QR code image for easy scanning
                      </p>
                      <Input type="file" className="hidden" id="btc-qr" onChange={handleQrCodeUpload} />
                      <label htmlFor="btc-qr">
                        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ethereum (ETH)</h4>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input 
                      placeholder="Enter ETH wallet address" 
                      value={cryptoConfig.details.ethAddress}
                      onChange={(e) => setCryptoConfig({
                        ...cryptoConfig, 
                        details: {...cryptoConfig.details, ethAddress: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>QR Code</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload QR code image for easy scanning
                      </p>
                      <Input type="file" className="hidden" id="eth-qr" onChange={handleQrCodeUpload} />
                      <label htmlFor="eth-qr">
                        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Tether (USDT)</h4>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input 
                      placeholder="Enter USDT wallet address" 
                      value={cryptoConfig.details.usdtAddress}
                      onChange={(e) => setCryptoConfig({
                        ...cryptoConfig, 
                        details: {...cryptoConfig.details, usdtAddress: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supported Networks</Label>
                    <Input 
                      placeholder="Enter supported networks" 
                      value={cryptoConfig.details.network}
                      onChange={(e) => setCryptoConfig({
                        ...cryptoConfig, 
                        details: {...cryptoConfig.details, network: e.target.value}
                      })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Specify which networks you support (e.g., ERC20, TRC20, BEP20)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>QR Code</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload QR code image for easy scanning
                      </p>
                      <Input type="file" className="hidden" id="usdt-qr" onChange={handleQrCodeUpload} />
                      <label htmlFor="usdt-qr">
                        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Instructions</Label>
                <Textarea 
                  placeholder="Instructions for clients making cryptocurrency payments" 
                  className="min-h-[100px]"
                  value={cryptoConfig.instructions}
                  onChange={(e) => setCryptoConfig({...cryptoConfig, instructions: e.target.value})}
                />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cryptocurrency Advanced Settings</DialogTitle>
                    <DialogDescription>
                      Configure advanced settings for cryptocurrency payments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Required Confirmations</Label>
                      <Input 
                        type="number" 
                        defaultValue="3" 
                        min="1" 
                        max="10"
                      />
                      <p className="text-xs text-muted-foreground">
                        Number of blockchain confirmations required before accepting payment
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Price Volatility Handling</Label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm">
                        <option value="fixed">Fixed Rate (15 minutes)</option>
                        <option value="variable">Variable Rate (Real-time)</option>
                        <option value="locked">Locked Rate (1 hour)</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                onClick={() => handleConfigSave('Cryptocurrency')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile-money">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mobile Money Settings</CardTitle>
                  <CardDescription>Configure mobile payment options</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Enabled</span>
                  <Switch 
                    checked={mobileMoneyConfig.enabled} 
                    onCheckedChange={(checked) => setMobileMoneyConfig({...mobileMoneyConfig, enabled: checked})}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <select className="w-full border rounded-md px-3 py-2 text-sm">
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="9mobile">9Mobile Money</option>
                    <option value="glo">Glo Money</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Merchant Number</Label>
                  <Input 
                    placeholder="Enter merchant number" 
                    value={mobileMoneyConfig.details.merchantNumber}
                    onChange={(e) => setMobileMoneyConfig({
                      ...mobileMoneyConfig, 
                      details: {...mobileMoneyConfig.details, merchantNumber: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input 
                    placeholder="Enter business name" 
                    value={mobileMoneyConfig.details.businessName}
                    onChange={(e) => setMobileMoneyConfig({
                      ...mobileMoneyConfig, 
                      details: {...mobileMoneyConfig.details, businessName: e.target.value}
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key (Optional)</Label>
                  <Input type="password" placeholder="Enter API key" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Payment Instructions</Label>
                <Textarea 
                  placeholder="Instructions for clients making mobile money payments" 
                  className="min-h-[100px]"
                  value={mobileMoneyConfig.instructions}
                  onChange={(e) => setMobileMoneyConfig({...mobileMoneyConfig, instructions: e.target.value})}
                />
              </div>
              
              <Button 
                onClick={() => handleConfigSave('Mobile Money')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentMethodSetup;
