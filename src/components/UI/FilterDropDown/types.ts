export interface FilterConfig {
    key: string;
    label: string;
    type: 'dropdown' | 'date' | 'text';
    options?: string[];
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
}

export interface FilterState {
    [key: string]: any;
}
