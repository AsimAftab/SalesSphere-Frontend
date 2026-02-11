import React from 'react';

export interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style}></div>
    );
};

export default Skeleton;
