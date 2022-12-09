import React, { useState, useEffect } from 'react';
import { toSvg } from 'jdenticon';
import { Skeleton, Avatar, Image } from 'antd';

import useUser from '@/atom/user';

declare interface Props {
  size: number;
  hash: string;
}

export default function Component({ size, hash }: Props) {
  const [svg, setSvg] = useState(toSvg(hash, size));
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  const user = useUser();

  const blob = new Blob([svg], { type: 'image/svg+xml' }),
    url = URL.createObjectURL(blob);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);

        if (user.get().id.length > 0) {
          setSvg(toSvg(`${user.get().id}${Date.now()}`, size));
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [size, user, loading]);

  return loading ? (
    <Avatar
      icon={<Skeleton.Image active style={{ width: size, height: size }} />}
      size={size}
    />
  ) : (
    <Avatar
      icon={
        <Image
          src={!isLogged ? '/logo_circle.png' : url}
          alt="NiroHealth"
          preview={false}
        />
      }
      size={size}
    />
  );
}
