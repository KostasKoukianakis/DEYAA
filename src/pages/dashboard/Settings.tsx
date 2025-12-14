import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ρυθμίσεις</h1>
        <p className="text-gray-600">Διαχειριστείτε τις ρυθμίσεις του συστήματος</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Γενικές Ρυθμίσεις</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="site-title">Τίτλος Ιστοσελίδας</Label>
              <Input
                id="site-title"
                defaultValue="ΔΕΥΑΑ - Δημοτική Επιχείρηση Ύδρευσης Αποχέτευσης"
              />
            </div>
            <div>
              <Label htmlFor="site-email">Email Επικοινωνίας</Label>
              <Input
                id="site-email"
                type="email"
                defaultValue="info@deyaa.gr"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="site-description">Περιγραφή Ιστοσελίδας</Label>
            <Textarea
              id="site-description"
              defaultValue="Η Δημοτική Επιχείρηση Ύδρευσης και Αποχέτευσης παρέχει υπηρεσίες ύδρευσης και αποχέτευσης στην περιοχή μας."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Ρυθμίσεις Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input
                id="smtp-server"
                defaultValue="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                type="number"
                defaultValue="587"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input
                id="smtp-username"
                defaultValue="noreply@deyaa.gr"
              />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                defaultValue="••••••••"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" defaultChecked />
            <Label htmlFor="email-notifications">Ενεργοποίηση ειδοποιήσεων email</Label>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Ρυθμίσεις Ειδοποιήσεων</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Αυτόματη ειδοποίηση νέων ανακοινώσεων</Label>
                <p className="text-sm text-gray-500">Στέλνει email στους συνδρομητές όταν δημοσιεύεται νέα ανακοίνωση</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Ειδοποίηση ενημερώσεων προβλημάτων</Label>
                <p className="text-sm text-gray-500">Στέλνει email όταν υπάρχει ενημέρωση σε ένα πρόβλημα</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Ειδοποίηση προγραμματισμένης συντήρησης</Label>
                <p className="text-sm text-gray-500">Στέλνει email για προγραμματισμένες εργασίες συντήρησης</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Ειδοποίηση καθυστέρησης προβλημάτων</Label>
                <p className="text-sm text-gray-500">Στέλνει υπενθύμιση όταν ένα πρόβλημα καθυστερεί</p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Ρυθμίσεις Συστήματος</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="max-file-size">Μέγιστο μέγεθος αρχείων (MB)</Label>
              <Input
                id="max-file-size"
                type="number"
                defaultValue="10"
              />
            </div>
            <div>
              <Label htmlFor="backup-frequency">Συχνότητα backup (ώρες)</Label>
              <Input
                id="backup-frequency"
                type="number"
                defaultValue="24"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="maintenance-mode" />
            <Label htmlFor="maintenance-mode">Λειτουργία συντήρησης</Label>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          Αποθήκευση Ρυθμίσεων
        </Button>
      </div>
    </div>
  );
}
