import React, { useEffect, useState } from "react";
import { EmployeeStatusEnum, RoleEnum } from "../../../models/enums";
import { useNavigate } from "react-router";

interface Props {
  search: string;
  roleFilter: RoleEnum;
  statusFilter: EmployeeStatusEnum;
  onSearchChange: (v: string) => void;
  onRoleChange: (v: RoleEnum) => void;
  onStatusChange: (v: EmployeeStatusEnum) => void;
}

const FilterBar: React.FC<Props> = ({
  search,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery, onSearchChange]);

  return (
    <div className="filter-bar">
      <input
        className="search-input"
        placeholder="Search by name, email, phone, or CCCD..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select
        className="filter-select"
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value as RoleEnum)}
      >
        <option value={RoleEnum.STAFF}>Staff</option>
        <option value={RoleEnum.TECHNICIAN}>Technician</option>
      </select>

      <select
        className="filter-select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as EmployeeStatusEnum)}
      >
        <option value={EmployeeStatusEnum.All}>All</option>
        <option value={EmployeeStatusEnum.Available}>Available</option>
        <option value={EmployeeStatusEnum.Busy}>Busy</option>
        <option value={EmployeeStatusEnum.OnLeave}>On Leave</option>
      </select>

      <button
        onClick={() => navigate("/admin/add-employee")}
        className="add-employee-btn"
      >
        + Add Employee
      </button>
    </div>
  );
};

export default FilterBar;
