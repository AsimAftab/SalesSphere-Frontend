/**
 * BaseRepository - Abstract base class for API repositories
 *
 * Provides standardized CRUD operations following the Repository pattern.
 * Implements DRY principle by centralizing common API interaction logic.
 *
 * @example
 * ```typescript
 * class ProductRepository extends BaseRepository<Product, ApiProduct, NewProductFormData, UpdateProductFormData> {
 *   protected endpoints = PRODUCT_ENDPOINTS;
 *
 *   protected mapToFrontend(apiData: ApiProduct): Product {
 *     return ProductMapper.toFrontend(apiData);
 *   }
 *
 *   protected mapToPayload(data: NewProductFormData | UpdateProductFormData) {
 *     return ProductMapper.toFormData(data);
 *   }
 * }
 * ```
 */

import api from '../api';
import type { BaseEntity, QueryOptions, EndpointConfig } from './types';

/**
 * Abstract base repository class providing common CRUD operations.
 *
 * @template TFrontend - The frontend entity type (must extend BaseEntity)
 * @template TApi - The raw API response type
 * @template TCreate - The create request type
 * @template TUpdate - The update request type
 */
export abstract class BaseRepository<
  TFrontend extends BaseEntity,
  TApi = unknown,
  TCreate = Partial<TFrontend>,
  TUpdate = Partial<TFrontend>
> {
  /**
   * Endpoint configuration for the resource.
   * Subclasses must provide this.
   */
  protected abstract readonly endpoints: EndpointConfig;

  /**
   * Transform API response data to frontend model.
   * Subclasses must implement this mapping logic.
   */
  protected abstract mapToFrontend(apiData: TApi): TFrontend;

  /**
   * Transform create/update data to API payload.
   * Can return a plain object or FormData for multipart uploads.
   * Subclasses should override this if they need custom payload transformation.
   */
  protected mapToPayload(data: TCreate | TUpdate): Record<string, unknown> | FormData {
    return data as Record<string, unknown>;
  }

  /**
   * Extract data array from API response.
   * Handles both `response.data.data` and `response.data` structures.
   */
  protected extractArrayData(responseData: unknown): TApi[] {
    const data = responseData as { data?: TApi[] };
    const items = data?.data ?? responseData;
    return Array.isArray(items) ? items : [];
  }

  /**
   * Extract single item from API response.
   */
  protected extractSingleData(responseData: unknown): TApi {
    const data = responseData as { data?: TApi };
    return (data?.data ?? responseData) as TApi;
  }

  /**
   * Fetch all entities with optional query parameters.
   *
   * @param options - Optional query parameters for filtering, pagination, etc.
   * @returns Promise resolving to array of frontend entities
   */
  async getAll(options?: QueryOptions): Promise<TFrontend[]> {
    const response = await api.get(this.endpoints.BASE, { params: options });
    const items = this.extractArrayData(response.data);
    return items.map((item) => this.mapToFrontend(item));
  }

  /**
   * Fetch a single entity by ID.
   *
   * @param id - The entity ID
   * @returns Promise resolving to the frontend entity
   */
  async getById(id: string): Promise<TFrontend> {
    const response = await api.get(this.endpoints.DETAIL(id));
    const item = this.extractSingleData(response.data);
    return this.mapToFrontend(item);
  }

  /**
   * Create a new entity.
   *
   * @param data - The creation data
   * @returns Promise resolving to the newly created frontend entity
   */
  async create(data: TCreate): Promise<TFrontend> {
    const payload = this.mapToPayload(data);
    const response = await api.post(this.endpoints.BASE, payload);
    const item = this.extractSingleData(response.data);
    return this.mapToFrontend(item);
  }

  /**
   * Update an existing entity.
   *
   * @param id - The entity ID to update
   * @param data - The update data
   * @returns Promise resolving to the updated frontend entity
   */
  async update(id: string, data: TUpdate): Promise<TFrontend> {
    const payload = this.mapToPayload(data);
    const response = await api.put(this.endpoints.DETAIL(id), payload);
    const item = this.extractSingleData(response.data);
    return this.mapToFrontend(item);
  }

  /**
   * Update an existing entity using PATCH (partial update).
   *
   * @param id - The entity ID to update
   * @param data - The partial update data
   * @returns Promise resolving to the updated frontend entity
   */
  async patch(id: string, data: Partial<TUpdate>): Promise<TFrontend> {
    const payload = this.mapToPayload(data as TUpdate);
    const response = await api.patch(this.endpoints.DETAIL(id), payload);
    const item = this.extractSingleData(response.data);
    return this.mapToFrontend(item);
  }

  /**
   * Delete a single entity.
   *
   * @param id - The entity ID to delete
   * @returns Promise resolving to success status
   */
  async delete(id: string): Promise<boolean> {
    const response = await api.delete(this.endpoints.DETAIL(id));
    const data = response.data as { success?: boolean };
    return data?.success ?? true;
  }

  /**
   * Delete multiple entities by their IDs.
   * Requires `endpoints.BULK_DELETE` to be defined.
   *
   * @param ids - Array of entity IDs to delete
   * @returns Promise resolving to success status
   */
  async bulkDelete(ids: string[]): Promise<boolean> {
    if (!this.endpoints.BULK_DELETE) {
      throw new Error('Bulk delete endpoint not configured for this repository');
    }
    const response = await api.delete(this.endpoints.BULK_DELETE, { data: { ids } });
    const data = response.data as { success?: boolean };
    return data?.success ?? true;
  }
}

export default BaseRepository;
