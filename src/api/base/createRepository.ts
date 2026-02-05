/**
 * Repository Factory - Creates repository instances with minimal boilerplate
 *
 * Provides a functional approach to creating repositories when extending
 * BaseRepository class is overkill for simple CRUD operations.
 *
 * @example
 * ```typescript
 * const categoryRepository = createRepository<Category, ApiCategory>({
 *   endpoints: {
 *     BASE: '/categories',
 *     DETAIL: (id) => `/categories/${id}`,
 *   },
 *   mapToFrontend: (api) => ({ id: api._id, name: api.name }),
 * });
 *
 * // Usage
 * const categories = await categoryRepository.getAll();
 * ```
 */

import api from '../api';
import type { BaseEntity, QueryOptions, EndpointConfig } from './types';

/**
 * Configuration for creating a repository.
 */
export interface RepositoryConfig<TFrontend extends BaseEntity, TApi, TCreate, TUpdate> {
  /**
   * Endpoint configuration for the resource.
   */
  endpoints: EndpointConfig;

  /**
   * Transform API response to frontend model.
   */
  mapToFrontend: (apiData: TApi) => TFrontend;

  /**
   * Optional: Transform create/update data to API payload.
   */
  mapToPayload?: (data: TCreate | TUpdate) => Record<string, unknown> | FormData;
}

/**
 * Repository interface returned by createRepository.
 */
export interface Repository<TFrontend extends BaseEntity, TCreate, TUpdate> {
  getAll(options?: QueryOptions): Promise<TFrontend[]>;
  getById(id: string): Promise<TFrontend>;
  create(data: TCreate): Promise<TFrontend>;
  update(id: string, data: TUpdate): Promise<TFrontend>;
  patch(id: string, data: Partial<TUpdate>): Promise<TFrontend>;
  delete(id: string): Promise<boolean>;
  bulkDelete(ids: string[]): Promise<boolean>;
}

/**
 * Creates a repository with standard CRUD operations.
 *
 * @param config - Repository configuration
 * @returns Repository object with CRUD methods
 */
export function createRepository<
  TFrontend extends BaseEntity,
  TApi = unknown,
  TCreate = Partial<TFrontend>,
  TUpdate = Partial<TFrontend>
>(
  config: RepositoryConfig<TFrontend, TApi, TCreate, TUpdate>
): Repository<TFrontend, TCreate, TUpdate> {
  const { endpoints, mapToFrontend, mapToPayload } = config;

  const extractArrayData = (responseData: unknown): TApi[] => {
    const data = responseData as { data?: TApi[] };
    const items = data?.data ?? responseData;
    return Array.isArray(items) ? items : [];
  };

  const extractSingleData = (responseData: unknown): TApi => {
    const data = responseData as { data?: TApi };
    return (data?.data ?? responseData) as TApi;
  };

  const toPayload = mapToPayload ?? ((data: TCreate | TUpdate) => data as Record<string, unknown>);

  return {
    async getAll(options?: QueryOptions): Promise<TFrontend[]> {
      const response = await api.get(endpoints.BASE, { params: options });
      const items = extractArrayData(response.data);
      return items.map(mapToFrontend);
    },

    async getById(id: string): Promise<TFrontend> {
      const response = await api.get(endpoints.DETAIL(id));
      const item = extractSingleData(response.data);
      return mapToFrontend(item);
    },

    async create(data: TCreate): Promise<TFrontend> {
      const payload = toPayload(data);
      const response = await api.post(endpoints.BASE, payload);
      const item = extractSingleData(response.data);
      return mapToFrontend(item);
    },

    async update(id: string, data: TUpdate): Promise<TFrontend> {
      const payload = toPayload(data);
      const response = await api.put(endpoints.DETAIL(id), payload);
      const item = extractSingleData(response.data);
      return mapToFrontend(item);
    },

    async patch(id: string, data: Partial<TUpdate>): Promise<TFrontend> {
      const payload = toPayload(data as TUpdate);
      const response = await api.patch(endpoints.DETAIL(id), payload);
      const item = extractSingleData(response.data);
      return mapToFrontend(item);
    },

    async delete(id: string): Promise<boolean> {
      const response = await api.delete(endpoints.DETAIL(id));
      const data = response.data as { success?: boolean };
      return data?.success ?? true;
    },

    async bulkDelete(ids: string[]): Promise<boolean> {
      if (!endpoints.BULK_DELETE) {
        throw new Error('Bulk delete endpoint not configured');
      }
      const response = await api.delete(endpoints.BULK_DELETE, { data: { ids } });
      const data = response.data as { success?: boolean };
      return data?.success ?? true;
    },
  };
}

export default createRepository;
