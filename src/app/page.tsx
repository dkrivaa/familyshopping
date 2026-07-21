import { getItems, addItem } from "@/app/actions/shoppinglist";
import NewItem from "@/components/custom/newItem";
import DisplayList from "@/components/custom/displayList";

export default async function HomePage() {
  const items = await getItems();

  return (
    <main className="min-h-screen mx-4 flex flex-col items-center">
      <NewItem onSubmit={addItem} />

      <DisplayList items={items} />
    </main>
  );
}
