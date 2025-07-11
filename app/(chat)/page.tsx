import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { generateUUID } from '@/lib/utils';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';
import { generateIntegrationAppCustomerAccessToken } from '@/lib/integration-app/generateCustomerAccessToken';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  const token = await generateIntegrationAppCustomerAccessToken({
    id: session.user.id,
    name: session.user.name ?? '',
  });

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
      />
    </>
  );
}
