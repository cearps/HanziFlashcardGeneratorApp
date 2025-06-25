import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "react-router";

export default function WordLists() {
  // TODO: Fetch word lists from the backend

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Word Lists</h1>
        <Link to="/app/wordlist/create">
          <Button>Create New Word List</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Word Lists</CardTitle>
          <CardDescription>
            Here are the word lists you have created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have any word lists yet. Create one to get started!
          </p>
          {/* TODO: Map over word lists and display them */}
        </CardContent>
      </Card>
    </div>
  );
}
