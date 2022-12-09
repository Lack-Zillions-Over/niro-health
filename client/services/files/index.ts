import { useState } from 'react';

import HttpGet from '@/services/utils/http-get';

import Queries from '@/services/files/queries.type';

export default function CompaniesService() {
  const [loading, setLoading] = useState(false);

  return {
    loading,
    findAll: async (query: Queries.FindAll.Query) => {
      const $response = await HttpGet<Queries.FindAll.Data>(
        'api/files',
        query,
        setLoading,
      );

      if ($response.statusCode !== 200) throw new Error($response.message);

      return $response;
    },
  } as const;
}
