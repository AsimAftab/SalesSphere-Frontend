import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { BlogManagementTable, BlogManagementSkeleton } from './components';
import { getAdminPosts, deletePost, updatePost } from '@/api/blogService';
import type { BlogPost } from '@/api/blogService';
import { useAuth } from '@/api/authService';
import { usePagination } from '@/hooks';
import { Pagination, EmptyState, PageHeader } from '@/components/ui';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';

const ADMIN_BLOG_QUERY_KEY = 'adminBlogPosts';

const BlogManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission('blog', 'create');
  const canUpdate = hasPermission('blog', 'update');
  const canDelete = hasPermission('blog', 'delete');

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: [ADMIN_BLOG_QUERY_KEY],
    queryFn: getAdminPosts,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const {
    paginate,
    currentPage,
    totalPages,
    setCurrentPage,
    pageSize,
    startIndex,
  } = usePagination<BlogPost>(posts.length, { initialPageSize: 10 });

  const paginatedPosts = paginate(posts);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      toast.success('Blog post deleted successfully');
      queryClient.invalidateQueries({ queryKey: [ADMIN_BLOG_QUERY_KEY] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to delete post');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (post: BlogPost) =>
      updatePost(post.id, {
        status: post.status === 'published' ? 'draft' : 'published',
      }),
    onSuccess: (_, post) => {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
      queryClient.invalidateQueries({ queryKey: [ADMIN_BLOG_QUERY_KEY] });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to update post status');
    },
  });

  const handleEdit = useCallback(
    (post: BlogPost) => {
      navigate(`/system-admin/blog/edit/${post.id}`);
    },
    [navigate],
  );

  const handleDelete = useCallback((post: BlogPost) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = () => {
    if (postToDelete) {
      deleteMutation.mutate(postToDelete.id);
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handleToggleStatus = useCallback(
    (post: BlogPost) => {
      toggleStatusMutation.mutate(post);
    },
    [toggleStatusMutation],
  );

  if (isLoading) {
    return <BlogManagementSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Blog Management"
        subtitle="Manage blog posts, drafts, and publications"
        permissions={{ canCreate }}
        createButtonLabel="New Post"
        onCreate={() => navigate('/system-admin/blog/new')}
        showFilter={false}
      />

      {posts.length === 0 ? (
        <EmptyState
          title="No blog posts yet"
          description="Create your first blog post to get started."
          icon="FileText"
        />
      ) : (
        <>
          <BlogManagementTable
            data={paginatedPosts}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            permissions={{ canUpdate, canDelete }}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              itemsPerPage={pageSize}
              totalItems={posts.length}
            />
          )}
        </>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmButtonText="Delete Post"
        cancelButtonText="Cancel"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

export default BlogManagementPage;
