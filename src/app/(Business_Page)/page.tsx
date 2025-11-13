import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/canvas-editor">
        <Button variant="default">Canvas Editor</Button>
      </Link>
    </div>
  );
}
