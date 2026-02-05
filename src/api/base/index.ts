// Base Repository Pattern Exports

// Types
export type {
  BaseEntity,
  ApiResponse,
  PaginatedApiResponse,
  QueryOptions,
  IBaseRepository,
  IBulkRepository,
  IMapper,
  IPayloadMapper,
  EndpointConfig,
} from './types';

// Abstract Classes
export { BaseRepository, default } from './BaseRepository';

// Factory Functions
export { createRepository } from './createRepository';
export type { RepositoryConfig, Repository } from './createRepository';
