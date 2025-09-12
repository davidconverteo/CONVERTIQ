import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PlaceholderPage() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">MMM</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Page en construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
