import type { Route } from "./+types/home";
import BaseLayout from "~/sections/base";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hanzi Flashcard App" },
    { name: "home", content: "欢迎你来到我的新app！" },
  ];
}

export default function Home() {
  return (
    <BaseLayout>
      <h1>test</h1>
    </BaseLayout>
  );
}
