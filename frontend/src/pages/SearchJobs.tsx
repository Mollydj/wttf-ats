import { Card } from "welcome-ui/Card";
import { Field } from "welcome-ui/Field";
import { InputText } from "welcome-ui/InputText";
import { CONTRACT_TYPE_OPTIONS, WORK_MODE_OPTIONS } from "../utils/jobMap";
import { Button } from "welcome-ui/Button";
import { Select } from "welcome-ui/Select";

type SearchJobsProps = {
  form: {
    title: string;
    office: string;
    work_mode: string;
    contract_type: string;
  };
  setField: (
    field: "title" | "office" | "work_mode" | "contract_type",
    value: string,
  ) => void;
  hasActiveFilters: boolean;
  onSearch: () => void;
  onReset: () => void;
};

export const SearchJobs = ({
  form,
  setField,
  hasActiveFilters,
  onSearch,
  onReset,
}: SearchJobsProps) => {
  return (
    <Card className="mb-lg" style={{ overflow: "visible" }}>
      <Card.Body style={{ overflow: "visible" }}>
        <div className="flex flex-wrap gap-md items-end">
          <Field label="Job title" className="flex-1 min-w-180">
            <InputText
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Backend Engineer"
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </Field>

          <Field label="Location" className="flex-1 min-w-180">
            <InputText
              value={form.office}
              onChange={(e) => setField("office", e.target.value)}
              placeholder="e.g. Paris"
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />
          </Field>

          <Field
            label="Work mode"
            className="min-w-160"
            style={{ overflow: "visible" }}
          >
            <Select
              isClearable
              name="work_mode"
              value={form.work_mode}
              options={WORK_MODE_OPTIONS}
              onChange={(value) => {
                setField("work_mode", String(value ?? ""));
                onSearch();
              }}
            />
          </Field>

          <Field
            label="Contract type"
            className="min-w-180"
            style={{ overflow: "visible" }}
          >
            <Select
              isClearable
              name="contract_type"
              value={form.contract_type}
              options={CONTRACT_TYPE_OPTIONS}
              onChange={(value) => {
                setField("contract_type", String(value ?? ""));
                onSearch();
              }}
            />
          </Field>

          <div className="flex gap-sm">
            <Button onClick={onSearch} size="md">
              Search
            </Button>
            {hasActiveFilters && (
              <Button onClick={onReset} size="md" variant="tertiary">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
