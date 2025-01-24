import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Database Eventi</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lista Eventi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Contenuto in sviluppo...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Events;