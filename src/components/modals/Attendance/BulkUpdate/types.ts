import type { ModalBaseProps } from '../common/types';

export interface BulkUpdateModalProps extends ModalBaseProps {
    onConfirm: (status: string, note: string) => void;
    weekday: string;
}

export interface StatusOption {
    code: string;
    label: string;
    description?: string;
}
