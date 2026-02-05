/**
 * Base Types for Repository Pattern
 *
 * Provides foundational type definitions for all API repositories,
 * following the Interface Segregation Principle (ISP).
 */

// --- Base Entity Interface ---

/**
 * Base interface for all frontend entities.
 * All domain models should have an `id` field (mapped from `_id`).
 */
export interface BaseEntity {
  id: string;
}

// --- API Response Interfaces ---

/**
 * Standard API response structure from the backend.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Paginated API response structure.
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// --- Query Options ---

/**
 * Base query options for list operations.
 */
export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

// --- Repository Interface ---

/**
 * Base repository interface defining standard CRUD operations.
 * Repositories should implement this interface to ensure consistency.
 *
 * @template T - The frontend entity type
 * @template TCreate - The create request type (defaults to Partial<T>)
 * @template TUpdate - The update request type (defaults to Partial<T>)
 */
export interface IBaseRepository<
  T extends BaseEntity,
  TCreate = Partial<T>,
  TUpdate = Partial<T>
> {
  /**
   * Fetch all entities with optional filtering.
   */
  getAll(options?: QueryOptions): Promise<T[]>;

  /**
   * Fetch a single entity by ID.
   */
  getById(id: string): Promise<T>;

  /**
   * Create a new entity.
   */
  create(data: TCreate): Promise<T>;

  /**
   * Update an existing entity.
   */
  update(id: string, data: TUpdate): Promise<T>;

  /**
   * Delete a single entity.
   */
  delete(id: string): Promise<boolean>;
}

/**
 * Extended repository interface with bulk operations.
 */
export interface IBulkRepository<T extends BaseEntity> extends IBaseRepository<T> {
  /**
   * Delete multiple entities by their IDs.
   */
  bulkDelete(ids: string[]): Promise<boolean>;
}

// --- Mapper Interface ---

/**
 * Interface for data mappers that transform between API and frontend shapes.
 *
 * @template TApi - The raw API response type
 * @template TFrontend - The frontend entity type
 */
export interface IMapper<TApi, TFrontend> {
  /**
   * Transform API response to frontend model.
   */
  toFrontend(apiData: TApi): TFrontend;
}

/**
 * Extended mapper with payload transformation support.
 */
export interface IPayloadMapper<TApi, TFrontend, TPayload = unknown> extends IMapper<TApi, TFrontend> {
  /**
   * Transform frontend form data to API payload.
   */
  toPayload?(data: TPayload): Record<string, unknown>;

  /**
   * Transform frontend form data to FormData for multipart uploads.
   */
  toFormData?(data: TPayload): FormData;
}

// --- Endpoint Configuration ---

/**
 * Standard endpoint configuration for a resource.
 */
export interface EndpointConfig {
  BASE: string;
  DETAIL: (id: string) => string;
  BULK_DELETE?: string;
}
