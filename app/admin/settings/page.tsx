"use client"

import { Settings, Building2, Key, Bell, Shield, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Organization Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Organization</CardTitle>
            </div>
            <CardDescription>
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Organization Name</FieldLabel>
                <Input defaultValue="TechGlobal Inc." />
              </Field>
              <Field>
                <FieldLabel>Treasury Address (Stellar)</FieldLabel>
                <Input
                  defaultValue="GBZX...DEMO"
                  disabled
                  className="font-mono text-sm"
                />
              </Field>
              <Field>
                <FieldLabel>Default Currency</FieldLabel>
                <Input defaultValue="USD" disabled />
              </Field>
            </FieldGroup>
            <Button className="mt-4">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Key className="mr-2 h-4 w-4" />
              Generate View Key
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Export Audit Logs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing & Usage
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure how you receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payroll Processed</p>
              <p className="text-sm text-muted-foreground">
                Get notified when a payroll run is completed
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Low Treasury Balance</p>
              <p className="text-sm text-muted-foreground">
                Alert when treasury balance falls below threshold
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Unclaimed Payments</p>
              <p className="text-sm text-muted-foreground">
                Weekly summary of unclaimed disbursements
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Security Alerts</p>
              <p className="text-sm text-muted-foreground">
                Immediate notification of any security events
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
          <CardDescription>
            Manage access controls and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Require 2FA for all admin actions
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">IP Whitelisting</p>
              <p className="text-sm text-muted-foreground">
                Restrict access to approved IP addresses
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">
                Automatically log out after inactivity
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                defaultValue="30"
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
