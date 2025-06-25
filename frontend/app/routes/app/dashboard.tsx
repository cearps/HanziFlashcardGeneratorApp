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
    // Could also redirect if you want, e.g. <Navigate to="/login" /> in a real app
    return <p>Please log in to view your dashboard.</p>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}!</h1>
      <p className="text-muted-foreground mb-8">
        Create, manage, and export flashcards.
      </p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Flashcards Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Flashcards</CardTitle>
            <CardDescription>
              Create individual cards or batch import from word lists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/app/wordlist/create">
              <Button>Start Creating</Button>
            </Link>
          </CardContent>
        </Card>

        {/* My Collections Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Word Lists</CardTitle>
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

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A quick look at your latest actions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li># TODO</li>
              <li># TODO</li>
              <li># TODO</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
