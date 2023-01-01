import clsx from 'clsx';

enum TButton {
  Primary = 'text-white bg-green-500 hover:bg-green-700',
  Secondary = 'text-white bg-gray-500 hover:bg-gray-700',
  Danger = 'text-white bg-red-500 hover:bg-red-700',
}

type Buttons = keyof typeof TButton;

export interface Props {
  type: Buttons;
  className: string;
  children: React.ReactNode;
}

export default function Button(props: Props) {
  return (
    <button className={clsx(TButton[props.type], props.className)}>
      {props.children}
    </button>
  );
}
