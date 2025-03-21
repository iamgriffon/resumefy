import { redirect } from 'next/navigation';

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  redirect(`/${locale}/home`);
}
