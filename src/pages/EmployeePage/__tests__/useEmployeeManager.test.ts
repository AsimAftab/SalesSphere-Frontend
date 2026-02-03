import { describe, it, expect } from 'vitest';

// Extracted logic from useEmployeeManager

interface Employee {
    _id: string;
    name: string;
    role: string;
    customRoleId?: { _id: string; name: string } | string;
}

interface Role {
    _id: string;
    name: string;
}

function getEmployeeRoleName(employee: Employee, roles: Role[]): string {
    if (typeof employee.customRoleId === 'object' && employee.customRoleId?.name) {
        return employee.customRoleId.name;
    }
    if (typeof employee.customRoleId === 'string') {
        const foundRole = roles.find((r: Role) => r._id === employee.customRoleId);
        if (foundRole) return foundRole.name;
    }
    return employee.role || 'user';
}

function filterEmployees(
    employees: Employee[],
    searchTerm: string,
    roles: Role[]
): Employee[] {
    if (!employees) return [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    return employees.filter((employee) => {
        const roleName = getEmployeeRoleName(employee, roles) || '';
        const name = employee.name || '';
        return (
            name.toLowerCase().includes(lowerSearchTerm) ||
            roleName.toLowerCase().includes(lowerSearchTerm)
        );
    });
}

function paginateEmployees(
    employees: Employee[],
    currentPage: number,
    itemsPerPage: number
): Employee[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return employees.slice(startIndex, startIndex + itemsPerPage);
}

// Test data
const mockRoles: Role[] = [
    { _id: 'role1', name: 'Sales Manager' },
    { _id: 'role2', name: 'Admin' },
    { _id: 'role3', name: 'Field Agent' },
];

const mockEmployees: Employee[] = [
    { _id: '1', name: 'John Doe', role: 'user', customRoleId: { _id: 'role1', name: 'Sales Manager' } },
    { _id: '2', name: 'Jane Smith', role: 'admin', customRoleId: 'role2' },
    { _id: '3', name: 'Bob Wilson', role: 'user', customRoleId: { _id: 'role3', name: 'Field Agent' } },
    { _id: '4', name: 'Alice Brown', role: 'manager' },
    { _id: '5', name: 'Charlie Davis', role: 'user', customRoleId: 'role1' },
];

describe('Employee Manager - Role Name Resolution', () => {
    it('should return custom role name when customRoleId is object with name', () => {
        const result = getEmployeeRoleName(mockEmployees[0], mockRoles);
        expect(result).toBe('Sales Manager');
    });

    it('should lookup role name when customRoleId is string', () => {
        const result = getEmployeeRoleName(mockEmployees[1], mockRoles);
        expect(result).toBe('Admin');
    });

    it('should fallback to employee role when no custom role', () => {
        const result = getEmployeeRoleName(mockEmployees[3], mockRoles);
        expect(result).toBe('manager');
    });

    it('should return "user" when no role info available', () => {
        const noRoleEmployee: Employee = { _id: '6', name: 'Test', role: '' };
        const result = getEmployeeRoleName(noRoleEmployee, mockRoles);
        expect(result).toBe('user');
    });
});

describe('Employee Manager - Filter Logic', () => {
    it('should return all employees when no search term', () => {
        const result = filterEmployees(mockEmployees, '', mockRoles);
        expect(result).toHaveLength(5);
    });

    it('should filter by employee name', () => {
        const result = filterEmployees(mockEmployees, 'John', mockRoles);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('John Doe');
    });

    it('should filter by role name', () => {
        const result = filterEmployees(mockEmployees, 'Sales Manager', mockRoles);
        expect(result).toHaveLength(2); // John and Charlie both have Sales Manager role
    });

    it('should be case insensitive', () => {
        const result = filterEmployees(mockEmployees, 'JANE', mockRoles);
        expect(result).toHaveLength(1);
    });

    it('should return empty array when no matches', () => {
        const result = filterEmployees(mockEmployees, 'nonexistent', mockRoles);
        expect(result).toHaveLength(0);
    });

    it('should handle empty employees array', () => {
        const result = filterEmployees([], 'test', mockRoles);
        expect(result).toHaveLength(0);
    });

    it('should filter by partial name match', () => {
        const result = filterEmployees(mockEmployees, 'son', mockRoles);
        expect(result).toHaveLength(1); // Bob Wilson
    });
});

describe('Employee Manager - Pagination', () => {
    it('should return correct items for first page', () => {
        const result = paginateEmployees(mockEmployees, 1, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('1');
        expect(result[1]._id).toBe('2');
    });

    it('should return correct items for second page', () => {
        const result = paginateEmployees(mockEmployees, 2, 2);
        expect(result).toHaveLength(2);
        expect(result[0]._id).toBe('3');
    });

    it('should return remaining items on last page', () => {
        const result = paginateEmployees(mockEmployees, 3, 2);
        expect(result).toHaveLength(1);
        expect(result[0]._id).toBe('5');
    });

    it('should return empty for page beyond data', () => {
        const result = paginateEmployees(mockEmployees, 10, 2);
        expect(result).toHaveLength(0);
    });

    it('should handle default items per page of 12', () => {
        const result = paginateEmployees(mockEmployees, 1, 12);
        expect(result).toHaveLength(5); // All items fit on first page
    });
});
