"use client";

import { HomeClient } from "./client";
export default function HomePage() {
  return (
    <div className="flex w-full mx-auto max-w-3xl flex-col">
      <main>
        <HomeClient />
      </main>
    </div>
  );
}
