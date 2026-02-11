import type { ModalBaseProps } from '../common/types';

export interface AttendanceStatusModalProps extends ModalBaseProps {
    onSave: (newStatus: string, note: string) => void;
    employeeName: string;
    employeeId: string | null;
    dateString: string | null;
}

export interface StatusOption {
    code: string;
    label: string;
    color: string;
}
