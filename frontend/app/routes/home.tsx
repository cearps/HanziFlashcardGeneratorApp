import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hanzi Flashcard App" },
    { name: "home", content: "欢迎你来到我的新app！" },
  ];
}

export default function Home() {
  return <h1>Hanzi Flashcard App</h1>;
}
