
// Common Types for Attendance Modals
export interface ModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
    day: number;
    month: string;
    isWeeklyOffDay: boolean;
    organizationWeeklyOffDay: string; // e.g. "Sunday"
}
