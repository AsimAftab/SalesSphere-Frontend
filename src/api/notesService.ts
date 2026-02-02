import api from './api';
import { API_ENDPOINTS } from './endpoints';

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
class NoteMapper {
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
 * 4. Centralized Endpoints
 */
const ENDPOINTS = API_ENDPOINTS.notes;

/**
 * 5. Repository Pattern
 * Centralized data access logic
 */
export const NoteRepository = {
  /**
   * Fetches all notes with optional query parameters.
   * 
   * @param params - Optional query parameters for filtering
   * @returns Promise resolving to array of Note objects
   */
  async getAllNotes(params?: Record<string, unknown>): Promise<Note[]> {
    const response = await api.get(ENDPOINTS.BASE, { params });
    return response.data.success
      ? response.data.data.map(NoteMapper.toFrontend)
      : [];
  },

  /**
   * Fetches notes created by the current user.
   * 
   * @param params - Optional query parameters for filtering
   * @returns Promise resolving to array of Note objects created by current user
   */
  async getMyNotes(params?: Record<string, unknown>): Promise<Note[]> {
    const response = await api.get(ENDPOINTS.MY_NOTES, { params });
    return response.data.success
      ? response.data.data.map(NoteMapper.toFrontend)
      : [];
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await api.get(ENDPOINTS.DETAIL(id));
    return NoteMapper.toFrontend(response.data.data);
  },

  /**
   * Creates a new note.
   * 
   * @param data - Note creation data (title, description, optional entity links)
   * @returns Promise resolving to newly created Note object
   */
  async createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await api.post(ENDPOINTS.BASE, data);
    return NoteMapper.toFrontend(response.data.data);
  },

  async updateNote(id: string, data: Partial<CreateNoteRequest>): Promise<Note> {
    const response = await api.patch(ENDPOINTS.DETAIL(id), data);
    return NoteMapper.toFrontend(response.data.data);
  },

  async deleteNote(id: string): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.DETAIL(id));
    return response.data.success;
  },

  async bulkDeleteNotes(ids: string[]): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.BULK_DELETE, { data: { ids } });
    return response.data.success;
  },

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

    const response = await api.post(ENDPOINTS.IMAGES(noteId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.data; // Returns { imageNumber, imageUrl }
  },

  async deleteNoteImage(noteId: string, imageNumber: number): Promise<boolean> {
    const response = await api.delete(ENDPOINTS.IMAGE_DETAIL(noteId, imageNumber));
    return response.data.success;
  }
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