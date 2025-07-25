import { Pinecone } from '@pinecone-database/pinecone';
import type { ToolIndexItem } from '../types';

interface SearchActionsProps {
  /**
   * query to search for
   * e.g "get contacts"
   */
  query: string;

  /**
   * number of results to return
   */
  topK?: number;

  /**
   * namespace to search in
   */
  namespace?: string;

  /**
   * index name to search in
   */
  index: 'membrane' | 'client-tools';

  /**
   * filter to apply to the search
   */
  filter?: Record<string, any>;
}

const DEFAULT_NAMESPACE = '__default__';

export async function searchIndex({
  query,
  topK = 10,
  namespace = DEFAULT_NAMESPACE,
  filter,
  index,
}: SearchActionsProps) {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const indexName = (
    index === 'membrane'
      ? process.env.PINECONE_MEMBRANE_TOOLS
      : process.env.PINECONE_CLIENT_TOOLS
  ) as string;

  const pcIndex = pc.index(indexName);

  console.log(`Searching index: ${indexName}`, {
    namespace,
    filter,
    topK,
    query,
  });

  const results = await pcIndex.namespace(namespace).searchRecords({
    fields: ['*'],
    query: {
      topK,
      inputs: { text: query },
      ...(filter ? { filter } : {}),
    },
    rerank: {
      model: 'bge-reranker-v2-m3',
      rankFields: ['text'],
    },
  });

  console.log(`Found ${results.result.hits.length} results`);

  const relatedActions = results.result.hits.map((hit) => ({
    ...hit.fields,
    id: hit._id,
  })) as ToolIndexItem[];

  return relatedActions;
}
