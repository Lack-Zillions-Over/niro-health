import Guard from '@/guards/session'
import Layout from '@/components/layout'

import { MenuSchema } from '@/constants/sidebar-menu'

import { MessagesNotification } from '@/constants/guard'

import Loading from '@/containers/_global/_components/_loading'

import SessionExpired from '@/containers/_global/_components/_session-expired'

declare interface Props {
  menu: MenuSchema[];
  children: React.ReactNode;
}

export default function Component({ menu, children }: Props) {
  const { loading, isBlocked } = Guard({
    fallback: {
      notification: {
        enabled: true,
        title: 'Session',
        message: MessagesNotification.pleaseLoginToContinue,
      },
      redirectTo: '/'
    }
  });

  const onMounted = () =>
  (
    <>
      {
        isBlocked
          ? <SessionExpired />
          : <div className="w-[100%] p-5">
            {children}
          </div>
      }
    </>
  )

  const onLoading = () => <Loading />

  return <Layout
    menu={menu}
    content={(
      !loading ? onMounted() : onLoading()
    )}
  />
}
