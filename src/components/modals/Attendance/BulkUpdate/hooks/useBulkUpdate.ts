import { useState } from 'react';

export const useBulkUpdate = () => {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [error, setError] = useState<string | null>(null);

    return {
        selectedStatus,
        setSelectedStatus,
        note,
        setNote,
        error,
        setError
    };
};
