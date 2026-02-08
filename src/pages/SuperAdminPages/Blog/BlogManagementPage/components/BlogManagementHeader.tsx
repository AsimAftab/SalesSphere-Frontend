import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

interface BlogManagementHeaderProps {
  canCreate: boolean;
}

const BlogManagementHeader: React.FC<BlogManagementHeaderProps> = ({ canCreate }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blog Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage blog posts, drafts, and publications</p>
      </div>
      {canCreate && (
        <Button
          variant="secondary"
          onClick={() => navigate('/system-admin/blog/new')}
        >
          New Post
        </Button>
      )}
    </div>
  );
};

export default BlogManagementHeader;
