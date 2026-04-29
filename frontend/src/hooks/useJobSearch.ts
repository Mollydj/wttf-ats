import { useState, useCallback } from "react";
import { JobSearchParams } from "../types/types";

const INITIAL_FORM = {
  title: "",
  office: "",
  work_mode: "",
  contract_type: "",
};

export const useJobSearch = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({});

  const setField = useCallback((field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    const params: JobSearchParams = {};
    if (form.title.trim()) params.title = form.title.trim();
    if (form.office.trim()) params.office = form.office.trim();
    if (form.work_mode) params.work_mode = form.work_mode;
    if (form.contract_type) params.contract_type = form.contract_type;
    setSearchParams(params);
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setSearchParams({});
  }, []);

  const hasActiveFilters = Object.values(form).some((v) => v !== "");

  return { form, setField, searchParams, hasActiveFilters, handleSearch, handleReset };
};