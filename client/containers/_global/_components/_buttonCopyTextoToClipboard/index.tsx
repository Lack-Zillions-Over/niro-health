import { message } from 'antd'

import * as Styles from '@/containers/_global/_components/_buttonCopyTextoToClipboard/styles';

declare interface Props {
  text: string;
}

export default function Component({ text }: Props) {
  return (
    <Styles.ButtonCopyTextoToClipboard
      onClick={() => {
        message.success('Text copied to clipboard!');
        navigator.clipboard.writeText(text);
      }}
    >
      Copy to clipboard
    </Styles.ButtonCopyTextoToClipboard>
  )
}
