import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hanzi Flashcard App" },
    { name: "home", content: "欢迎你来到我的新app！" },
  ];
}

const Home: React.FC = () => {
  return (
    <div className="text-center mt-12">
      <h1 className="text-4xl font-bold">Hanzi Flashcard App</h1>
      <p className="mt-4 text-lg">欢迎你来到我的新app！</p>
    </div>
  );
};

export default Home;
