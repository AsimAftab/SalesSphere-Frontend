export interface FilterConfig {
    key: string;
    label: string;
    type: 'dropdown' | 'date' | 'text';
    options?: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export interface FilterState {
    [key: string]: string;
}
