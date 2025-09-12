
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { User, Bell, Lock, Palette } from 'lucide-react';

export default function SettingsPage() {
    const { toast } = useToast();
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
    
    const [profile, setProfile] = useState({ name: 'Jean Dupont', email: 'jean.dupont@example.com' });
    const [notifications, setNotifications] = useState({ weeklyReport: true, campaignAlerts: true });
    
    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
    }
    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        toast({ title: "Mot de passe modifié", description: "Votre nouveau mot de passe est actif." });
    }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="space-y-8 md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><User /> Profil</CardTitle>
            <CardDescription>Gérez vos informations personnelles et de contact.</CardDescription>
          </CardHeader>
          <form onSubmit={handleProfileSave}>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline">Changer l'avatar</Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Adresse e-mail</Label>
                        <Input id="email" type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Enregistrer les modifications</Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Lock /> Sécurité</CardTitle>
            <CardDescription>Modifiez votre mot de passe.</CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordChange}>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input id="new-password" type="password" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le nouveau mot de passe</Label>
                    <Input id="confirm-password" type="password" />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit">Changer le mot de passe</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Bell /> Notifications</CardTitle>
            <CardDescription>Choisissez comment vous souhaitez être notifié.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="weekly-report">Rapport hebdomadaire par e-mail</Label>
                <Switch id="weekly-report" checked={notifications.weeklyReport} onCheckedChange={checked => setNotifications(n => ({...n, weeklyReport: checked}))} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="campaign-alerts">Alertes de performance des campagnes</Label>
                <Switch id="campaign-alerts" checked={notifications.campaignAlerts} onCheckedChange={checked => setNotifications(n => ({...n, campaignAlerts: checked}))}/>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Palette /> Apparence</CardTitle>
            <CardDescription>Personnalisez l'apparence de l'application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="dark-mode">Mode Sombre</Label>
                <Switch id="dark-mode" onCheckedChange={(checked) => {
                    document.documentElement.classList.toggle('dark', checked);
                }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
