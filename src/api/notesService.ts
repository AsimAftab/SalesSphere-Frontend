import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';

/**
 * 1. Interface Segregation
 * Defining UI-friendly types for Notes and Images
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface NoteImage {
  imageNumber: number;
  imageUrl: string;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  partyId?: string;
  partyName?: string;
  prospectId?: string;
  prospectName?: string;
  siteId?: string;
  siteName?: string;
  images: NoteImage[];
  createdBy: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  description: string;
  party?: string;    // MongoDB ID
  prospect?: string; // MongoDB ID
  site?: string;     // MongoDB ID
}

/**
 * 2. API Response Interfaces
 * Mirroring the backend MongoDB document structure
 */
interface ApiUser {
  _id: string;
  name: string;
  email: string;
}

interface ApiNoteResponse {
  _id: string;
  title: string;
  description: string;
  party?: { _id: string; partyName: string };
  prospect?: { _id: string; prospectName: string };
  site?: { _id: string; siteName: string };
  images: Array<{ imageNumber: number; imageUrl: string; publicId?: string }>;
  createdBy: ApiUser;
  createdAt: string;
  updatedAt: string;
}

/**
 * NoteMapper - Transforms note data between backend API shape and frontend domain models.
 * Handles populated entity references and sanitizes sensitive image data.
 */
export class NoteMapper {
  /**
   * Transforms an API note response to frontend Note model.
   * Handles optional party/prospect/site references and sanitizes image publicId.
   *
   * @param apiNote - Raw note data from backend API
   * @returns Normalized Note object for frontend use
   */
  static toFrontend(apiNote: ApiNoteResponse): Note {
    return {
      id: apiNote._id,
      title: apiNote.title,
      description: apiNote.description,
      // Mapping references conditionally
      partyId: apiNote.party?._id,
      partyName: apiNote.party?.partyName,
      prospectId: apiNote.prospect?._id,
      prospectName: apiNote.prospect?.prospectName,
      siteId: apiNote.site?._id,
      siteName: apiNote.site?.siteName,
      // Sanitizing images (removing sensitive publicId)
      images: apiNote.images.map(img => ({
        imageNumber: img.imageNumber,
        imageUrl: img.imageUrl
      })),
      createdBy: {
        id: apiNote.createdBy?._id || '',
        name: apiNote.createdBy?.name || 'Unknown',
        email: apiNote.createdBy?.email || ''
      },
      createdAt: apiNote.createdAt,
      updatedAt: apiNote.updatedAt
    };
  }
}

/**
 * 3. Endpoint Configuration
 */
const NOTE_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.notes.BASE,
  DETAIL: API_ENDPOINTS.notes.DETAIL,
  BULK_DELETE: API_ENDPOINTS.notes.BULK_DELETE,
};

/**
 * 4. NoteRepositoryClass - Extends BaseRepository for standard CRUD operations
 *
 * Demonstrates how to use BaseRepository while adding entity-specific methods.
 * This approach reduces boilerplate while maintaining flexibility.
 */
class NoteRepositoryClass extends BaseRepository<Note, ApiNoteResponse, CreateNoteRequest, Partial<CreateNoteRequest>> {
  protected readonly endpoints = NOTE_ENDPOINTS;

  protected mapToFrontend(apiData: ApiNoteResponse): Note {
    return NoteMapper.toFrontend(apiData);
  }

  // --- Entity-specific methods ---

  /**
   * Fetches notes created by the current user.
   *
   * @param params - Optional query parameters for filtering
   * @returns Promise resolving to array of Note objects created by current user
   */
  async getMyNotes(params?: Record<string, unknown>): Promise<Note[]> {
    const response = await api.get(API_ENDPOINTS.notes.MY_NOTES, { params });
    return response.data.success
      ? response.data.data.map(NoteMapper.toFrontend)
      : [];
  }

  /**
   * Uploads an image to a specific note.
   *
   * @param noteId - ID of the note to attach image to
   * @param imageNumber - Sequential image number (1 or 2)
   * @param file - Image file to upload
   * @returns Promise resolving to image metadata (imageNumber, imageUrl)
   */
  async uploadNoteImage(noteId: string, imageNumber: number, file: File): Promise<NoteImage> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageNumber', imageNumber.toString());

    const response = await api.post(API_ENDPOINTS.notes.IMAGES(noteId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data;
  }

  /**
   * Deletes an image from a note.
   *
   * @param noteId - ID of the note
   * @param imageNumber - Image number to delete
   * @returns Promise resolving to success status
   */
  async deleteNoteImage(noteId: string, imageNumber: number): Promise<boolean> {
    const response = await api.delete(API_ENDPOINTS.notes.IMAGE_DETAIL(noteId, imageNumber));
    return response.data.success;
  }
}

// Create singleton instance
const noteRepositoryInstance = new NoteRepositoryClass();

/**
 * 5. NoteRepository - Public API maintaining backward compatibility
 *
 * Maps the class methods to the familiar object-literal interface
 * that existing code expects.
 */
export const NoteRepository = {
  // Standard CRUD (from BaseRepository)
  getAllNotes: (params?: Record<string, unknown>) => noteRepositoryInstance.getAll(params),
  getNoteById: (id: string) => noteRepositoryInstance.getById(id),
  createNote: (data: CreateNoteRequest) => noteRepositoryInstance.create(data),
  updateNote: (id: string, data: Partial<CreateNoteRequest>) => noteRepositoryInstance.patch(id, data),
  deleteNote: (id: string) => noteRepositoryInstance.delete(id),
  bulkDeleteNotes: (ids: string[]) => noteRepositoryInstance.bulkDelete(ids),

  // Entity-specific methods
  getMyNotes: (params?: Record<string, unknown>) => noteRepositoryInstance.getMyNotes(params),
  uploadNoteImage: (noteId: string, imageNumber: number, file: File) =>
    noteRepositoryInstance.uploadNoteImage(noteId, imageNumber, file),
  deleteNoteImage: (noteId: string, imageNumber: number) =>
    noteRepositoryInstance.deleteNoteImage(noteId, imageNumber),
};

// Destructured exports for clean usage in components
export const {
  getAllNotes,
  getMyNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  bulkDeleteNotes,
  uploadNoteImage,
  deleteNoteImage
} = NoteRepository;
