import { useState } from "react";
import { useAuth } from "~/context/AuthContext";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "react-router";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading] = useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}!</h1>
      <p className="text-muted-foreground mb-8">
        Create, manage, and export flashcards.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>
              View and manage your flashcard decks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/app/decks">
              <Button>View Flashcard Decks</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Word Lists</CardTitle>
            <CardDescription>
              View and manage your flashcard word lists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/app/wordlist/wordlists">
              <Button>View Word Lists</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
